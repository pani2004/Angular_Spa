import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '../config/dynamodb.config.js';
import config from '../config/env.config.js';

const TABLE_NAME = config.dynamodb.refreshTokensTable;

/**
 * Store a refresh token
 * @param {string} token - Refresh token
 * @param {string} userId - User ID
 * @param {number} expiresAt - Expiration timestamp
 * @returns {Promise<object>} Stored token data
 */
async function create(token, userId, expiresAt) {
  const tokenData = {
    token,
    userId,
    expiresAt,
    createdAt: Date.now(),
    isRevoked: false
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: tokenData
  });

  await docClient.send(command);
  return tokenData;
}

/**
 * Find refresh token
 * @param {string} token - Refresh token
 * @returns {Promise<object|null>} Token data or null
 */
async function findByToken(token) {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { token }
  });

  const result = await docClient.send(command);
  return result.Item || null;
}

/**
 * Revoke (delete) a refresh token
 * @param {string} token - Refresh token
 * @returns {Promise<boolean>} True if deleted
 */
async function revoke(token) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { token }
  });

  await docClient.send(command);
  return true;
}

export {
  create,
  findByToken,
  revoke
};
