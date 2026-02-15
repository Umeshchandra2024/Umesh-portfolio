import 'dotenv/config';
import cloudinary from 'cloudinary';
import app from './app.js';
import { dbConnection } from './config/dbConnection.js';

const PORT = process.env.PORT || 5000;

// Database
dbConnection();

// Cloudinary configuration
if (process.env.CLOUDINARY_NAME) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});