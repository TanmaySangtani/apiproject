const errorMiddleware = (error, req, res, next) => {
  console.log("i am in middleware");
  // console.error(error);
  error.statusCode = error.status || 500;
  // error.status=error.status || 'error occured'
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
};
module.exports = errorMiddleware;
