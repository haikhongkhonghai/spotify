import express from "express";
import dotenv from "dotenv";
import cloudinary from "./lib/cloudinary.js";

dotenv.config();

const debugApp = express();

debugApp.get("/debug", async (req, res) => {
	const debug = {
		timestamp: new Date().toISOString(),
		environment: {
			NODE_ENV: process.env.NODE_ENV,
			PORT: process.env.PORT,
			ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "✅ Set" : "❌ Missing",
		},
		database: {
			MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
		},
		cloudinary: {
			CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
			CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
			CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
		},
		clerk: {
			CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
			CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "✅ Set" : "❌ Missing",
		}
	};

	// Test Cloudinary connection
	try {
		await cloudinary.api.resources({
			resource_type: "auto",
			max_results: 1
		});
		debug.cloudinary.connection = "✅ Connected";
	} catch (error) {
		debug.cloudinary.connection = `❌ Failed: ${error.message}`;
		debug.cloudinary.error_code = error.http_code;
	}

	res.json(debug);
});

export default debugApp;
