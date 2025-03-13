import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Ensures HTTPS upload
});

// Function to upload images
export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file, {
      folder: "testimonial-blog", // Store images in a specific folder
      use_filename: true,
      unique_filename: false,
    });

    return result.secure_url; // Return the Cloudinary image URL
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};
