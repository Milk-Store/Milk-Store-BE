const chatbotService = require("../services/chatbot.service");
const sendResponse = require("../utils/responseFormatter");
const { MESSAGE } = require("../constants/messages");
const { STATUS } = require("../constants/httpStatusCodes");

// Xử lý tin nhắn từ user và trả về phản hồi từ AI
const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        'Tin nhắn không được để trống',
        null,
        false
      );
    }

    // Giới hạn độ dài tin nhắn
    if (message.length > 500) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        'Tin nhắn quá dài (tối đa 500 ký tự)',
        null,
        false
      );
    }
    
    // Xử lý tin nhắn với AI
    const aiResponse = await chatbotService.processMessageWithAI(message.trim());
    
    sendResponse(res, STATUS.SUCCESS, 'Xử lý tin nhắn thành công', {
      reply: aiResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chatbot message processing error:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      'Có lỗi xảy ra khi xử lý tin nhắn',
      null,
      false,
      error.message
    );
  }
};

// Tìm kiếm sản phẩm theo từ khóa
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        'Từ khóa tìm kiếm không được để trống',
        null,
        false
      );
    }

    console.log('Searching products with query:', query);
    
    // Tìm kiếm sản phẩm
    const products = await chatbotService.searchProducts(query.trim());
    
    sendResponse(res, STATUS.SUCCESS, 'Tìm kiếm sản phẩm thành công', {
      products,
      query: query.trim(),
      count: products.length
    });
    
  } catch (error) {
    console.error('Product search error:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      'Có lỗi xảy ra khi tìm kiếm sản phẩm',
      null,
      false,
      error.message
    );
  }
};

// Gợi ý sản phẩm theo danh mục
const suggestProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return sendResponse(
        res,
        STATUS.BAD_REQUEST,
        'Tên danh mục không được để trống',
        null,
        false
      );
    }

    console.log('Suggesting products for category:', category);
    
    // Gợi ý sản phẩm theo danh mục
    const products = await chatbotService.suggestProductsByCategory(category.trim());
    
    sendResponse(res, STATUS.SUCCESS, 'Gợi ý sản phẩm thành công', {
      products,
      category: category.trim(),
      count: products.length
    });
    
  } catch (error) {
    console.error('Product suggestion error:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      'Có lỗi xảy ra khi gợi ý sản phẩm',
      null,
      false,
      error.message
    );
  }
};

// Lấy thông tin bot (có thể mở rộng sau)
const getBotInfo = async (req, res) => {
  try {
    const botInfo = {
      name: 'Mẹ Xíu Assistant',
      version: '1.0.0',
      description: 'Trợ lý ảo của cửa hàng Mẹ Xíu',
      capabilities: [
        'Tư vấn sản phẩm',
        'Tìm kiếm sản phẩm',
        'Hướng dẫn đặt hàng',
        'Thông tin vận chuyển',
        'Liên hệ hỗ trợ'
      ],
      contact: {
        hotline: '0906532932',
        cskh: ['0902741222', '0798932932'],
        address: '84 Âu Cơ, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng'
      },
      workingHours: {
        start: '08:00',
        end: '22:00'
      }
    };
    
    sendResponse(res, STATUS.SUCCESS, 'Lấy thông tin bot thành công', botInfo);
    
  } catch (error) {
    console.error('Get bot info error:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      'Có lỗi xảy ra khi lấy thông tin bot',
      null,
      false,
      error.message
    );
  }
};

// Health check cho chatbot service
const healthCheck = async (req, res) => {
  try {
    // Kiểm tra kết nối database và AI service
    const productData = await chatbotService.getProductData();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        ai: 'available',
        products: productData.products.length,
        categories: productData.categories.length
      }
    };
    
    sendResponse(res, STATUS.SUCCESS, 'Chatbot service hoạt động bình thường', healthStatus);
    
  } catch (error) {
    console.error('Chatbot health check error:', error);
    sendResponse(
      res,
      STATUS.SERVER_ERROR,
      'Chatbot service có vấn đề',
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      false
    );
  }
};

module.exports = {
  processMessage,
  searchProducts,
  suggestProducts,
  getBotInfo,
  healthCheck
}; 