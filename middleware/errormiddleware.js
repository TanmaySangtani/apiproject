const errorMiddleware = (error, req, res, next) => {
  
  error.statusCode = error.status || 500;
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
module.exports = errorMiddleware;
