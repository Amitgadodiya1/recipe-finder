import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Folder setup
const folderPath = process.env.LOCAL_FOLDER || "./dishes";
const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "food_recipes";

async function uploadAll() {
  const files = fs.readdirSync(folderPath);
  const uploaded = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    console.log("📤 Uploading:", file);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        folder: cloudinaryFolder,
        use_filename: true,
        unique_filename: false,
      });

      uploaded.push({
        name: path.parse(file).name.replace(/_/g, " "),
        cloudinary_url: res.secure_url,
      });
    } catch (err) {
      console.error("❌ Error uploading", file, err.message);
    }
  }

  fs.writeFileSync("cloudinary_urls.json", JSON.stringify(uploaded, null, 2));
  console.log("✅ Upload complete! URLs saved to cloudinary_urls.json");
}

uploadAll();
