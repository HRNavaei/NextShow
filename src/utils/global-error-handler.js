import OperationalError from './OperationalError.js';
import { errorList } from './OperationalError.js';

export default (err, req, res, next) => {
  // Log the error in development mode for debugging purposes
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  let revisedErr = err;
  if (!err.isOperational) {
    // Check if the error should be revised to an operational one

    if (err.name === 'ValidationError') {
      revisedErr = handleValidationError(err);
    } else {
      /*
       * Reaching here means that the error is a programming or
       * an unhandled operational error which means it's a bug
       */

      const resObj = { status: 'error' };
      if (process.env.NODE_ENV === 'development') {
        resObj.err = err.message;
      } else resObj.message = 'Internal Error';

      return res.status(500).json(resObj);
    }
  }

  // Reaching here means that the error is an operational one
  res.status(revisedErr.statusCode).json({
    status: revisedErr.status,
    errorCode: revisedErr.errorCode,
    message: revisedErr.message,
    errors: revisedErr.errors,
  });
};

function handleValidationError(err) {
  const validationErr = new OperationalError('VALIDATION_ERROR');
  validationErr.errors = [];

  Object.values(err.errors).forEach((val) => {
    const errObj = {
      name: val.name,
      field: val.path,
      code: val.message,
      message: errorList[val.message]?.message ?? 'Unknown validation error',
    };
    if (val.name === 'CastError') {
      errObj.requiredType = val.kind;
      errObj.providedType = val.valueType;
    }
    validationErr.errors.push(errObj);
  });

  return validationErr;
}
