const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // 1. Joi Validation Errors
  if (err.isJoi || (err.name === 'ValidationError' && err.isJoi)) {
    statusCode = 400;
    message = err.details ? err.details.map(d => d.message).join(', ') : err.message;
  }
  
  // 2. Mongoose Connection/Server Errors
  else if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    statusCode = 500;
    message = 'Database connection error';
  }
  
  // 3. Axios Timeout & Connection Errors
  else if (err.isAxiosError || err.code === 'ECONNABORTED' || err.code === 'ECONNREFUSED') {
    if (err.code === 'ECONNABORTED') {
      statusCode = 503;
      message = 'ML API timeout';
    } else if (err.code === 'ECONNREFUSED') {
      statusCode = 503;
      message = 'ML API unavailable';
    } else {
      statusCode = 503;
      message = 'ML API error';
    }
  }

  // Log error for debugging purposes (optional)
  console.error(`[ErrorHandler] ${statusCode} - ${message}`);

  // Always return the specific JSON format
  res.status(statusCode).json({
    error: true,
    message: message
  });
};

module.exports = errorHandler;
