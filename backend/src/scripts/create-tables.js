import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from '../config/dynamodb.config.js';
import config from '../config/env.config.js';

/**
 * Check if table exists
 */
async function tableExists(tableName) {
  try {
    const command = new DescribeTableCommand({ TableName: tableName });
    await dynamoDBClient.send(command);
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

/**
 * Create Users table
 */
async function createUsersTable() {
  const tableName = config.dynamodb.usersTable;

  if (await tableExists(tableName)) {
    console.log(`✓ Table ${tableName} already exists`);
    return;
  }

  const command = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  });

  await dynamoDBClient.send(command);
  console.log(`✓ Created table: ${tableName}`);
}

/**
 * Create Refresh Tokens table
 */
async function createRefreshTokensTable() {
  const tableName = config.dynamodb.refreshTokensTable;

  if (await tableExists(tableName)) {
    console.log(`✓ Table ${tableName} already exists`);
    return;
  }

  const command = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      { AttributeName: 'token', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'token', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    TimeToLiveSpecification: {
      AttributeName: 'expiresAt',
      Enabled: true
    }
  });

  await dynamoDBClient.send(command);
  console.log(`✓ Created table: ${tableName}`);
}

/**
 * Wait for table to be active
 */
async function waitForTable(tableName) {
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    try {
      const command = new DescribeTableCommand({ TableName: tableName });
      const response = await dynamoDBClient.send(command);
      
      if (response.Table.TableStatus === 'ACTIVE') {
        return true;
      }
    } catch (error) {
      // Table not ready yet
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error(`Table ${tableName} did not become active`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🗄️  Creating DynamoDB tables...\n');

    await createUsersTable();
    await createRefreshTokensTable();

    console.log('\n⏳ Waiting for tables to be active...');
    await waitForTable(config.dynamodb.usersTable);
    await waitForTable(config.dynamodb.refreshTokensTable);

    console.log('\n✅ All tables created successfully!');
    console.log('\nTables:');
    console.log(`  - ${config.dynamodb.usersTable}`);
    console.log(`  - ${config.dynamodb.refreshTokensTable}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

main();
