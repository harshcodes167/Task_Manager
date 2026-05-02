const sendSuccess = (res, statusCode, message, data = {}) => {
  const response = { success: true, message };
  if (Object.keys(data).length > 0) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
