import cloudinary from "../lib/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

const testCloudinaryConfig = async () => {
	console.log("🔍 Testing Cloudinary Configuration...");
	
	// Check environment variables
	console.log("📋 Environment Variables:");
	console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing");
	console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
	console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");
	
	if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
		console.error("❌ Missing required Cloudinary environment variables!");
		return;
	}
	
	try {
		// Test connection by getting account details
		const result = await cloudinary.api.resources({
			resource_type: "auto",
			max_results: 1
		});
		
		console.log("✅ Cloudinary connection successful!");
		console.log("📊 Account info:", {
			total_count: result.total_count,
			rate_limit_allowed: result.rate_limit_allowed,
			rate_limit_remaining: result.rate_limit_remaining
		});
		
	} catch (error) {
		console.error("❌ Cloudinary connection failed:");
		console.error("Error code:", error.http_code);
		console.error("Error message:", error.message);
		
		if (error.http_code === 401) {
			console.error("🔑 Authentication failed - check your API credentials!");
		} else if (error.http_code === 403) {
			console.error("🚫 Access denied - check your account permissions!");
		} else if (error.http_code === 429) {
			console.error("⏰ Rate limit exceeded - try again later!");
		}
	}
};

testCloudinaryConfig();
