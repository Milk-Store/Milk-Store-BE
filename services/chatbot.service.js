const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyB_OdCkwSuXvgGoqk_xOsE42k7_bkXqz8A";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Lấy thông tin sản phẩm và danh mục từ database
const getProductData = async () => {
  try {
    const products = await Product.findAll({
      where: { status: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      attributes: ['id', 'name', 'description', 'price', 'image', 'category_id'],
      limit: 50 // Giới hạn để tránh prompt quá dài
    });

    const categories = await Category.findAll({
      attributes: ['id', 'name', 'image']
    });

    return {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category?.name || 'Không phân loại'
      })),
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        image: c.image
      }))
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return { products: [], categories: [] };
  }
};

// Tạo prompt cho AI với context về cửa hàng và sản phẩm
const createPrompt = (userMessage, productData) => {
  const { products, categories } = productData;
  
  const productList = products.map(p => 
    `- ${p.name} (${p.category}): ${p.price}đ - ${p.description || 'Không có mô tả'}`
  ).join('\n');

  const categoryList = categories.map(c => 
    `- ${c.name} (ID: ${c.id})${c.image ? ` (có hình ảnh)` : ''}`
  ).join('\n');

  return `Bạn là trợ lý ảo của cửa hàng "MẸ XÍU" - chuyên bán các sản phẩm sữa và thực phẩm cho mẹ và bé tại Đà Nẵng.

THÔNG TIN CỬA HÀNG:
- Tên: MẸ XÍU - Thế giới sữa mẹ xíu
- Hotline: 0906532932
- CSKH: 0902741222 (Zalo), 0798932932 (Zalo)
- Địa chỉ: 84 Âu Cơ, Hoà Khánh Bắc, Liên Chiểu, Đà Nẵng
- Ship COD toàn quốc, phí ship 15k-30k tùy địa chỉ
- Thời gian giao hàng: 1-3 ngày

DANH MỤC SẢN PHẨM:
${categoryList}

SẢN PHẨM HIỆN CÓ:
${productList}

HƯỚNG DẪN TRẢ LỜI:
1. Luôn thân thiện, nhiệt tình, sử dụng emoji phù hợp
2. Khi khách hỏi về sản phẩm hoặc danh mục cụ thể, trả về đường link: "Bạn có thể xem chi tiết tại: http://localhost:5173/products?category=[ID_DANH_MỤC]"
3. Khi khách hỏi về tất cả sản phẩm, trả về: "Bạn có thể xem tất cả sản phẩm tại: http://localhost:5173/products"
4. Khi khách hỏi về giá, ship, đặt hàng: hướng dẫn cụ thể
5. Khi khách hỏi về liên hệ: cung cấp thông tin hotline và địa chỉ
6. Trả lời bằng tiếng Việt, ngắn gọn nhưng đầy đủ thông tin
7. Nếu khách hỏi về sản phẩm không có trong danh sách, gợi ý sản phẩm tương tự và đưa link
8. Luôn kết thúc bằng lời mời liên hệ hoặc đặt hàng

CÂU HỎI CỦA KHÁCH: "${userMessage}"

Hãy trả lời một cách tự nhiên và hữu ích:`;
};

// Hàm tự động bọc mọi link sản phẩm bằng thẻ <a> có class tailwind
function formatProductLinks(text) {
  if (!text) return text;
  // Regex tìm link sản phẩm dạng http://localhost:5173/products hoặc có ?category=...
  return text.replace(/(http:\/\/localhost:5173\/products(\?category=\d+)?)/g, (match) => {
    // Xác định text hiển thị
    let display = 'Xem tất cả sản phẩm';
    if (match.includes('?category=')) display = 'Xem sản phẩm danh mục này';
    return `<a href='${match}' target='_blank' class='text-blue-600 underline hover:text-blue-800'>${display}</a>`;
  });
}

// Xử lý tin nhắn với AI
const processMessageWithAI = async (userMessage) => {
  try {
    // Lấy dữ liệu sản phẩm từ database
    const productData = await getProductData();
    
    // Kiểm tra xem có phải hỏi về danh mục cụ thể không
    const categoryMatch = findCategoryMatch(userMessage, productData.categories);
    if (categoryMatch) {
      return formatProductLinks(`Chúng tôi có danh mục "${categoryMatch.name}" với nhiều sản phẩm chất lượng! Bạn có thể xem chi tiết tại: http://localhost:5173/products?category=${categoryMatch.id} 🛍️<br/><br/>Hoặc gọi hotline 0906532932 để được tư vấn trực tiếp! 📞`);
    }
    
    // Kiểm tra xem có phải hỏi về tất cả sản phẩm không
    if (isAskingForAllProducts(userMessage)) {
      return formatProductLinks(`Chúng tôi có đầy đủ các loại sản phẩm sữa và thực phẩm cho mẹ và bé! Bạn có thể xem tất cả sản phẩm tại: http://localhost:5173/products 🥛<br/><br/>Hoặc gọi hotline 0906532932 để được tư vấn trực tiếp! 📞`);
    }
    
    // Tạo prompt với context
    const prompt = createPrompt(userMessage, productData);
    
    // Gọi AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    return formatProductLinks(aiResponse.trim());
  } catch (error) {
    console.error('AI processing error:', error);
    
    // Fallback responses nếu AI lỗi
    const fallbackResponses = {
      greeting: 'Xin chào! Tôi là trợ lý ảo của Mẹ Xíu. Tôi có thể giúp bạn tìm hiểu về sản phẩm, đặt hàng hoặc hỗ trợ khác. Bạn cần gì ạ? 😊',
      product: 'Chúng tôi có nhiều loại sản phẩm sữa chất lượng cao như sữa tươi, sữa đặc, sữa chua, sữa bột... Bạn có thể xem chi tiết tại: http://localhost:5173/products 🥛',
      order: 'Để đặt hàng, bạn có thể:\n1. Thêm sản phẩm vào giỏ hàng\n2. Vào trang Giỏ hàng\n3. Chọn phương thức thanh toán\n4. Xác nhận đơn hàng\n\nHoặc gọi hotline 0906532932 để được hỗ trợ trực tiếp! 📞',
      shipping: 'Chúng tôi ship COD toàn quốc! Thời gian giao hàng từ 1-3 ngày tùy khu vực. Phí ship từ 15k-30k tùy địa chỉ. Bạn có muốn tôi hướng dẫn đặt hàng không? 🚚',
      contact: 'Bạn có thể liên hệ chúng tôi qua:\n📞 Hotline: 0906532932\n📞 CSKH: 0902741222 (Zalo)\n📞 CSKH: 0798932932 (Zalo)\n\nHoặc đến trực tiếp các cửa hàng của chúng tôi! 🏪',
      default: 'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về sản phẩm, đặt hàng, vận chuyển hoặc liên hệ. Tôi sẽ cố gắng hỗ trợ tốt nhất! 🤔'
    };

    // Phân loại câu hỏi để trả về response phù hợp
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return formatProductLinks(fallbackResponses.greeting);
    }
    
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('mua') || lowerMessage.includes('giá')) {
      return formatProductLinks(fallbackResponses.product);
    }
    
    if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('mua hàng') || lowerMessage.includes('thanh toán')) {
      return formatProductLinks(fallbackResponses.order);
    }
    
    if (lowerMessage.includes('ship') || lowerMessage.includes('giao hàng') || lowerMessage.includes('vận chuyển')) {
      return formatProductLinks(fallbackResponses.shipping);
    }
    
    if (lowerMessage.includes('liên hệ') || lowerMessage.includes('hotline') || lowerMessage.includes('số điện thoại')) {
      return formatProductLinks(fallbackResponses.contact);
    }
    
    return formatProductLinks(fallbackResponses.default);
  }
};

// Tìm danh mục phù hợp với tin nhắn người dùng
const findCategoryMatch = (userMessage, categories) => {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const category of categories) {
    const categoryName = category.name.toLowerCase();
    if (lowerMessage.includes(categoryName)) {
      return category;
    }
  }
  
  return null;
};

// Kiểm tra xem người dùng có hỏi về tất cả sản phẩm không
const isAskingForAllProducts = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  const keywords = [
    'tất cả sản phẩm', 'tất cả', 'xem sản phẩm', 'danh sách sản phẩm',
    'sản phẩm gì', 'có gì', 'bán gì', 'mặt hàng', 'hàng hóa'
  ];
  
  return keywords.some(keyword => lowerMessage.includes(keyword));
};

// Tìm kiếm sản phẩm theo từ khóa
const searchProducts = async (query) => {
  try {
    const products = await Product.findAll({
      where: {
        status: true,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ],
      attributes: ['id', 'name', 'description', 'price', 'image'],
      limit: 10
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category?.name || 'Không phân loại'
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Gợi ý sản phẩm theo danh mục
const suggestProductsByCategory = async (categoryName) => {
  try {
    const category = await Category.findOne({
      where: {
        name: { [Op.like]: `%${categoryName}%` }
      }
    });

    if (!category) {
      return [];
    }

    const products = await Product.findAll({
      where: {
        category_id: category.id,
        status: true
      },
      attributes: ['id', 'name', 'description', 'price', 'image'],
      limit: 5
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: category.name
    }));
  } catch (error) {
    console.error('Error suggesting products by category:', error);
    return [];
  }
};

module.exports = {
  processMessageWithAI,
  searchProducts,
  suggestProductsByCategory,
  getProductData,
  findCategoryMatch,
  isAskingForAllProducts
}; 