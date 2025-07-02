// Minh họa cách Cloudinary sử dụng API Key và Secret

// 1. API_KEY: Định danh ứng dụng
const publicId = "spotify-clone/song_123";
const timestamp = Math.round(new Date().getTime() / 1000);

// 2. API_SECRET: Tạo chữ ký bảo mật
const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
const signature = crypto
  .createHash('sha1')
  .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
  .digest('hex');

// 3. Request upload với cả 3 thông tin
const uploadRequest = {
  api_key: process.env.CLOUDINARY_API_KEY,    // Định danh
  timestamp: timestamp,                        // Thời gian
  signature: signature,                        // Chữ ký bảo mật
  // ... file data
};

// 4. Cloudinary verify:
// - Kiểm tra API_KEY có tồn tại không
// - Dùng API_SECRET để verify signature
// - Nếu hợp lệ → Upload thành công
// - Trả về secure_url để lưu vào database
