import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		console.log("🔐 Checking admin permissions...");
		console.log("User ID:", req.auth.userId);
		console.log("Admin email from env:", process.env.ADMIN_EMAIL);

		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		console.log("Current user email:", currentUser.primaryEmailAddress?.emailAddress);
		
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			console.log("❌ Admin access denied");
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		console.log("✅ Admin access granted");
		next();
	} catch (error) {
		console.error("❌ Error in requireAdmin middleware:", error);
		next(error);
	}
};
