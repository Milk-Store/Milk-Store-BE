/**
 * Hàm chuẩn hóa response format 
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Message trả về cho client
 * @param {any} data - Dữ liệu trả về (optional)
 * @param {Boolean} success - Trạng thái thành công/thất bại
 * @param {any} error - Thông tin lỗi (optional)
 * @returns {Object} - JSON response
 */
const sendResponse = (
  res,
  statusCode,
  message,
  data = null,
  success = true,
  error = null
) => {
  const response = {
    status: statusCode,
    message: message,
    success: success,
  };

  // Chỉ thêm vào response nếu có giá trị
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  if (error !== null && error !== undefined) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;
