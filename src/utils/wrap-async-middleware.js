const wrapAsyncMiddleware = (_function) => {
  /*
   * This wraps async middleware functions so any thrown errors are automatically
   * passed to the global error handler. It removes the need for an overall try/catch
   * block in each middleware.
   */
  return (req, res, next) => {
    _function(req, res, next).catch(next);
  };
};

export default wrapAsyncMiddleware;
