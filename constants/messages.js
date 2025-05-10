const MESSAGE = {
  SUCCESS: {
    GET_SUCCESS: "Lấy dữ liệu thành công!",
    CREATED: "Tạo mới thành công!",
    UPDATED: "Cập nhật thành công!",
    DELETED: "Xóa thành công!",
    LOGIN_SUCCESS: "Đăng nhập thành công!",
    LOGOUT_SUCCESS: "Đăng xuất thành công!",
    TOKEN_REFRESHED: "Làm mới token thành công!",
    EXPIRED_TOKENS_REMOVED: "Đã xóa các token hết hạn!"
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
    EMAIL_PASSWORD_REQUIRED: "Email và mật khẩu là bắt buộc."
  },
};

module.exports = { MESSAGE };