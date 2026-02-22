import { PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../config/dynamodb.config.js';
import config from '../config/env.config.js';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = config.dynamodb.usersTable;

/**
 * Create a new user
 * @param {object} userData - User data
 * @returns {Promise<object>} Created user
 */
async function create(userData) {
  const user = {
    userId: uuidv4(),
    email: userData.email,
    passwordHash: userData.passwordHash,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role || 'USER',
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastLogin: null
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
    ConditionExpression: 'attribute_not_exists(email)' // Prevent duplicate emails
  });

  try {
    await docClient.send(command);
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('User with this email already exists');
    }
    throw error;
  }
}

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} User object or null
 */
async function findById(userId) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { userId }
  });

  const result = await docClient.send(command);
  return result.Item || null;
}

/**
 * Find user by email (using GSI)
 * @param {string} email - User email
 * @returns {Promise<object|null>} User object or null
 */
async function findByEmail(email) {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  });

  const result = await docClient.send(command);
  return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

/**
 * Update user
 * @param {string} userId - User ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated user
 */
async function update(userId, updates) {
  // Build update expression dynamically
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  // Add updatedAt automatically
  updates.updatedAt = Date.now();

  Object.keys(updates).forEach((key, index) => {
    updateExpressions.push(`#${key} = :val${index}`);
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:val${index}`] = updates[key];
  });

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  });

  const result = await docClient.send(command);
  return result.Attributes;
}

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if deleted
 */
async function deleteUser(userId) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { userId }
  });

  await docClient.send(command);
  return true;
}

/**
 * Get all users (admin only - uses scan)
 * @param {number} limit - Maximum number of results
 * @returns {Promise<array>} Array of users
 */
async function getAllUsers(limit = 100) {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    Limit: limit,
    ProjectionExpression: 'userId, email, firstName, lastName, #role, isActive, createdAt, lastLogin',
    ExpressionAttributeNames: {
      '#role': 'role' // 'role' is a reserved word in DynamoDB
    }
  });

  const result = await docClient.send(command);
  return result.Items || [];
}

/**
 * Update last login timestamp
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
async function updateLastLogin(userId) {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId },
    UpdateExpression: 'SET lastLogin = :now',
    ExpressionAttributeValues: {
      ':now': Date.now()
    }
  });

  await docClient.send(command);
}

export {
  create,
  findById,
  findByEmail,
  update,
  deleteUser,
  getAllUsers,
  updateLastLogin
};
