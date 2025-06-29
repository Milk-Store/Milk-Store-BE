const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "AIzaSyB_OdCkwSuXvgGoqk_xOsE42k7_bkXqz8A";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generatePostAI({ topic, keywords, description }) {
  const prompt = `Viết một bài blog về chủ đề: "${topic}". Từ khóa: ${
    keywords || ""
  }. Mô tả: ${description || ""}.

Yêu cầu:
- Bài viết cần có: tiêu đề, tóm tắt, nội dung chi tiết, meta title, meta description.
- Nội dung chi tiết (content) trả về ở định dạng HTML, sử dụng các thẻ như <h1>, <h2>, <ul>, <li>, <strong>, <p>, v.v.
- Content PHẢI dài, chi tiết, nhiều ý, nhiều đoạn, nhiều mục, đảm bảo phong phú, hấp dẫn, phù hợp cho một bài viết blog chuẩn SEO (tối thiểu 1500-2000 từ, càng dài càng tốt).
- Trong phần content, PHẢI chèn ít nhất 3-5 chú thích ảnh minh họa ở các vị trí hợp lý, mỗi chú thích dùng cú pháp: <strong> IMAGE_PLACEHOLDER: Mô tả ảnh cần chèn, ví dụ: Ảnh sản phẩm sữa nổi bật, Ảnh chương trình khuyến mãi, Ảnh khách hàng hài lòng, ... </strong>
- Các chú thích ảnh nên đặt ở đầu bài, giữa bài và cuối bài để bài viết sinh động, dễ hình dung vị trí chèn ảnh.
- Trả về kết quả dạng JSON với các trường: title, excerpt, content, metaTitle, metaDescription.

Ví dụ:
{
  "title": "Sale sữa trẻ em Đà Nẵng: Cơ hội vàng cho mẹ",
  "excerpt": "Chương trình sale lớn cho sữa trẻ em tại Đà Nẵng...",
  "content": "<h1>Sale sữa trẻ em Đà Nẵng</h1><strong> IMAGE_PLACEHOLDER: Ảnh banner chương trình sale </strong><p>Chào mừng bạn đến với chương trình sale lớn nhất năm cho các sản phẩm sữa trẻ em tại Đà Nẵng!</p><h2>Lý do nên mua</h2><ul><li>Chất lượng đảm bảo</li><li>Giá tốt</li></ul><strong> IMAGE_PLACEHOLDER: Ảnh sản phẩm sữa nổi bật </strong><h2>Khách hàng hài lòng</h2><p>...</p><strong> IMAGE_PLACEHOLDER: Ảnh khách hàng sử dụng sản phẩm </strong><h2>Thông tin liên hệ</h2><p>Liên hệ ngay để nhận ưu đãi!</p>",
  "metaTitle": "Sale sữa trẻ em Đà Nẵng - Sữa hộp, sữa bột giá tốt",
  "metaDescription": "Chương trình sale lớn cho sữa trẻ em tại Đà Nẵng, nhiều ưu đãi hấp dẫn cho mẹ và bé."
}

Chỉ trả về đúng một object JSON như ví dụ trên.`;
  let model;
  let result;
  let response;
  let text = "";

  try {
    // Thử model mới nhất
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    result = await model.generateContent(prompt);
    response = await result.response;
    text = response.text();
  } catch (err) {
    // Nếu lỗi model, thử lại với model cũ hơn
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      result = await model.generateContent(prompt);
      response = await result.response;
      text = response.text();
    } catch (err2) {
      throw err2;
    }
  }
  return text;
}

module.exports = { generatePostAI };
