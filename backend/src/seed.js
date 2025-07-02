import { connectDB } from "./lib/db.js";
import { seedData } from "./lib/seedData.js";
import { config } from "dotenv";

config();

const runSeed = async () => {
	try {
		console.log("🌱 Starting database seeding...");
		await connectDB();
		await seedData();
		console.log("✅ Seeding completed successfully!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
};

runSeed();
