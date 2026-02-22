import app from './src/app.js';
import config from './src/config/env.config.js';

const PORT = config.port;


app.listen(PORT, () => {
  console.log('===========================================');
  console.log(`Server running in ${config.node_env} mode`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`DynamoDB: ${config.aws.dynamodbEndpoint}`);
  console.log('===========================================');
});

