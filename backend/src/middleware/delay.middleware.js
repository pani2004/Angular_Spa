/**
 * Delay middleware for demonstrating async processing
 * Adds artificial delay based on query parameter
 */
async function delayMiddleware(req, res, next) {
  const delay = parseInt(req.query.delay) || 0;
  const actualDelay = Math.min(Math.max(0, delay), 5000);

  if (actualDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, actualDelay));
  }

  next();
}

export default delayMiddleware;
