const { POST_STATUS } = require('./posts');

const MESSAGE = {
  SUCCESS: {
    GET_SUCCESS: "Lấy dữ liệu thành công!",
    CREATED: "Tạo mới thành công!",
    UPDATED: "Cập nhật thành công!",
    DELETED: "Xóa thành công!",
    LOGIN_SUCCESS: "Đăng nhập thành công!",
    LOGOUT_SUCCESS: "Đăng xuất thành công!",
    TOKEN_REFRESHED: "Làm mới token thành công!",
    EXPIRED_TOKENS_REMOVED: "Đã xóa các token hết hạn!",
    POST_CREATED: "Tạo bài viết thành công!",
    POST_UPDATED: "Cập nhật bài viết thành công!",
    POST_DELETED: "Xóa bài viết thành công!",
    POST_STATUS_UPDATED: "Cập nhật trạng thái bài viết thành công!",
    POST_FEATURED_TOGGLED: "Cập nhật trạng thái nổi bật thành công!",
    IMAGE_UPLOADED: "Tải ảnh lên thành công!"
  },
  ERROR: {
    INTERNAL: "Đã xảy ra lỗi nội bộ.",
    VALIDATION: "Lỗi xác thực.",
    NOT_FOUND: "Không tìm thấy tài nguyên được yêu cầu.",
    UNAUTHORIZED: "Truy cập trái phép.",
    FORBIDDEN: "Bạn không có quyền truy cập vào tài nguyên này.",
    PASSWORD_WRONG: "Sai mật khẩu.",
    DUPLICATE_EMAIL: "Email đã được sử dụng.",
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng.",
    USER_NOT_FOUND: "Người dùng không tồn tại.",
    TOKEN_REQUIRED: "Token là bắt buộc.",
    REFRESH_TOKEN_REQUIRED: "Refresh token là bắt buộc.",
    REFRESH_TOKEN_INVALID: "Refresh token không hợp lệ hoặc đã được sử dụng.",
    REFRESH_TOKEN_EXPIRED: "Refresh token đã hết hạn.",
    TOKEN_EXPIRED: "Token đã hết hạn. Vui lòng làm mới token.",
    EMAIL_PASSWORD_REQUIRED: "Email và mật khẩu là bắt buộc.",
    POST_NOT_FOUND: "Không tìm thấy bài viết.",
    POST_CREATE_FAILED: "Tạo bài viết thất bại.",
    POST_UPDATE_FAILED: "Cập nhật bài viết thất bại.",
    POST_DELETE_FAILED: "Xóa bài viết thất bại.",
    INVALID_POST_STATUS: `Trạng thái bài viết không hợp lệ. Các giá trị hợp lệ: ${Object.values(POST_STATUS).join(', ')}`,
    IMAGE_UPLOAD_FAILED: "Tải ảnh lên thất bại.",
    INVALID_IMAGE_FORMAT: "Định dạng ảnh không hợp lệ."
  },
  VALIDATION: {
    REQUIRED: (field) => `${field} là bắt buộc.`,
    INVALID: (field) => `${field} không hợp lệ`,
    MUST_BE_POSITIVE_NUMBER: (field) => `${field} phải là số dương.`,
    MIN_LENGTH: (field, min) => `${field} phải có ít nhất ${min} ký tự.`,
    MAX_LENGTH: (field, max) => `${field} không được vượt quá ${max} ký tự.`,
    POST_TITLE_REQUIRED: "Tiêu đề bài viết là bắt buộc.",
    POST_CONTENT_REQUIRED: "Nội dung bài viết là bắt buộc.",
    POST_STATUS_INVALID: `Trạng thái bài viết phải là một trong các giá trị: ${Object.values(POST_STATUS).join(', ')}`
  }
};

module.exports = { MESSAGE };