import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: "dm5lrxevq",
  api_key: "944546975782758",
  api_secret: "F60fe8gS0LcW3Xhf9UUGf7x6gqM",
});

const folderPath = "./dishes"; // your folder with all jpgs

async function uploadAll() {
  const files = fs.readdirSync(folderPath);
  const uploaded = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    console.log("Uploading:", file);

    const res = await cloudinary.uploader.upload(filePath, {
      folder: "food_recipes",
      use_filename: true,
      unique_filename: false,
    });

    uploaded.push({
      name: path.parse(file).name.replace(/_/g, " "),
      cloudinary_url: res.secure_url,
    });
  }

  fs.writeFileSync("cloudinary_urls.json", JSON.stringify(uploaded, null, 2));
  console.log("✅ Upload complete! URLs saved to cloudinary_urls.json");
}

uploadAll();
