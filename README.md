# Milk Store Backend

Backend API cho ứng dụng Milk Store.

## Yêu cầu hệ thống

- Node.js v14+ 
- MySQL v5.7+

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/username/milk-store-be.git
cd Milk-Store-BE
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```

4. Cấu hình các thông số trong file `.env`:
```
# Ứng dụng
NODE_ENV=development
PORT=8000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=milk_store_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Client
CLIENT_URL=http://localhost:5173

# Admin mặc định
ADMIN_EMAIL= giá trị từ biến môi trường `ADMIN_EMAIL`
ADMIN_PASSWORD= giá trị từ biến môi trường `ADMIN_PASSWORD`
```

5. Tạo database trong MySQL:
```sql
CREATE DATABASE milk_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Khởi tạo database và tạo tài khoản admin mặc định:
```bash
npm run init-db
```


## Sử dụng

### Chạy ở môi trường phát triển:
```bash
npm run dev
```

### Chạy ở môi trường production:
```bash
npm start
```

### Update db migration:
```bash
npx sequelize-cli db:migrate
```

## Tài khoản mặc định

- Email: giá trị từ biến môi trường `ADMIN_EMAIL`
- Mật khẩu: giá trị từ biến môi trường `ADMIN_PASSWORD`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Làm mới token

### Users
- `GET /api/users` - Lấy danh sách người dùng (admin)
- `POST /api/users/register` - Đăng ký tài khoản
- `PUT /api/users/:id` - Cập nhật người dùng
- `DELETE /api/users/:id` - Xóa người dùng (admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Thêm danh mục mới (admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (admin)
- `DELETE /api/categories/:id` - Xóa danh mục (admin)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Thêm sản phẩm mới (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng (admin)
- `DELETE /api/orders/:id` - Xóa đơn hàng (admin)

## Post API Endpoints

### Public Endpoints

#### 1. Get All Posts (Admin)
```
GET /api/posts
```
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- `featured` (boolean): Filter by featured status
- `search` (string): Search in title and content
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order ASC/DESC (default: DESC)

**Response:**
```json
{
  "status": 200,
  "message": "Lấy dữ liệu thành công!",
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 2. Get Published Posts (Public)
```
GET /api/posts/published
```
**Query Parameters:** Same as above, but only returns PUBLISHED posts

#### 3. Get Post by ID
```
GET /api/posts/:id
```
**Response:**
```json
{
  "status": 200,
  "message": "Lấy dữ liệu thành công!",
  "success": true,
  "data": {
    "id": 1,
    "title": "Bài viết mẫu",
    "content": "<p>Nội dung HTML từ React Quill</p>",
    "excerpt": "Tóm tắt bài viết",
    "thumbnail": "https://cloudinary.com/...",
    "status": "PUBLISHED",
    "featured": false,
    "viewCount": 150,
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com"
    },
    "images": [
      {
        "id": 1,
        "imageUrl": "https://cloudinary.com/...",
        "altText": "Mô tả ảnh",
        "caption": "Chú thích ảnh",
        "order": 0
      }
    ]
  }
}
```

### Admin Endpoints (Require Authentication)

#### 4. Create Post
```
POST /api/posts
```
**Headers:**
- `Authorization: Bearer <token>` or Cookie with access_token

**Body (multipart/form-data):**
- `title` (string, required): Post title (5-200 characters)
- `content` (string, required): HTML content from React Quill (min 10 characters)
- `excerpt` (string, optional): Post excerpt
- `status` (string, optional): DRAFT, PUBLISHED, ARCHIVED (default: DRAFT)
- `metaTitle` (string, optional): SEO meta title
- `metaDescription` (string, optional): SEO meta description
- `featured` (boolean, optional): Featured post (default: false)
- `thumbnail` (file, optional): Post thumbnail image
- `images` (string, optional): JSON string of images array

**Images Format:**
```json
[
  {
    "url": "https://cloudinary.com/...",
    "altText": "Mô tả ảnh",
    "caption": "Chú thích ảnh"
  }
]
```

#### 5. Update Post
```
PUT /api/posts/:id
```
**Body:** Same as Create Post

#### 6. Delete Post
```
DELETE /api/posts/:id
```

#### 7. Update Post Status
```
PATCH /api/posts/:id/status
```
**Body:**
```json
{
  "status": "PUBLISHED"
}
```

#### 8. Toggle Featured Status
```
PATCH /api/posts/:id/featured
```

#### 9. Upload Image for React Quill
```
POST /api/posts/upload-image
```
**Body (multipart/form-data):**
- `image` (file, required): Image file (max 5MB)

**Response:**
```json
{
  "status": 200,
  "message": "Tải ảnh lên thành công!",
  "success": true,
  "data": {
    "url": "https://cloudinary.com/...",
    "alt": "original-filename.jpg"
  }
}
```

## Post Model Structure

```javascript
{
  id: INTEGER (Primary Key),
  title: STRING (Required, 5-200 chars),
  content: TEXT (Required, HTML from React Quill),
  excerpt: TEXT (Optional),
  thumbnail: STRING (Optional, Cloudinary URL),
  status: ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') (Default: DRAFT),
  publishedAt: DATE (Optional, set when published),
  metaTitle: STRING (Optional, SEO),
  metaDescription: TEXT (Optional, SEO),
  featured: BOOLEAN (Default: false),
  viewCount: INTEGER (Default: 0),
  createdBy: INTEGER (Foreign Key to User),
  createdAt: DATE,
  updatedAt: DATE,
  deletedAt: DATE (Soft delete)
}
```

## PostImage Model Structure

```javascript
{
  id: INTEGER (Primary Key),
  postId: INTEGER (Foreign Key to Post),
  imageUrl: STRING (Required, Cloudinary URL),
  altText: STRING (Optional),
  caption: TEXT (Optional),
  order: INTEGER (Default: 0),
  createdAt: DATE,
  updatedAt: DATE,
  deletedAt: DATE (Soft delete)
}
```

## Error Responses

### Validation Errors
```json
{
  "status": 400,
  "message": "Tiêu đề bài viết là bắt buộc.",
  "success": false
}
```

### Authentication Errors
```json
{
  "status": 401,
  "message": "Truy cập trái phép.",
  "success": false
}
```

### Not Found Errors
```json
{
  "status": 404,
  "message": "Không tìm thấy bài viết.",
  "success": false
}
```

## React Quill Integration

The API is designed to work seamlessly with React Quill:

1. **Content Storage**: HTML content from React Quill is stored directly in the `content` field
2. **Image Upload**: Use `/api/posts/upload-image` endpoint for image uploads in the editor
3. **Multiple Images**: Store additional images in the `images` array for gallery features
4. **Rich Text Support**: Full HTML support for formatting, links, images, etc.

## Usage Examples

### Creating a Post with React Quill
```javascript
const formData = new FormData();
formData.append('title', 'My Post Title');
formData.append('content', '<p>HTML content from React Quill</p>');
formData.append('excerpt', 'Post summary');
formData.append('status', 'DRAFT');
formData.append('featured', 'false');
formData.append('thumbnail', thumbnailFile);
formData.append('images', JSON.stringify([
  { url: 'https://cloudinary.com/...', altText: 'Image 1', caption: 'Caption 1' }
]));

const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Uploading Image in React Quill
```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/posts/upload-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();
  return result.data.url; // Return URL for React Quill
};
```

## License

ISC