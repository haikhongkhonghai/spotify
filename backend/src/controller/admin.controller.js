import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
	try {
		console.log("🔄 Starting Cloudinary upload...");
		console.log("File details:", {
			name: file.name,
			size: file.size,
			mimetype: file.mimetype,
			tempFilePath: file.tempFilePath
		});

		// Check if file exists
		if (!file.tempFilePath) {
			throw new Error("Temp file path is missing");
		}

		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
			folder: "spotify-clone", // Organize uploads in folder
			use_filename: true,
			unique_filename: true,
		});

		console.log("✅ Cloudinary upload successful:", {
			public_id: result.public_id,
			secure_url: result.secure_url,
			resource_type: result.resource_type
		});

		return result.secure_url;
	} catch (error) {
		console.error("❌ Error in uploadToCloudinary:", error);
		console.error("Error details:", {
			message: error.message,
			http_code: error.http_code,
			api_error_code: error.api_error_code
		});
		throw new Error(`Cloudinary upload failed: ${error.message}`);
	}
};

export const createSong = async (req, res, next) => {
	try {
		console.log("🎵 Creating new song...");
		console.log("Request body:", req.body);
		console.log("Files received:", req.files ? Object.keys(req.files) : "No files");

		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			console.error("❌ Missing required files");
			return res.status(400).json({ 
				message: "Please upload all files",
				received: req.files ? Object.keys(req.files) : []
			});
		}

		const { title, artist, albumId, duration } = req.body;
		
		// Validate required fields
		if (!title || !artist || !duration) {
			return res.status(400).json({ 
				message: "Missing required fields: title, artist, duration" 
			});
		}

		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		console.log("📤 Uploading files to Cloudinary...");
		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		console.log("💾 Creating song in database...");
		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration: parseInt(duration),
			albumId: albumId || null,
		});

		await song.save();

		// if song belongs to an album, update the album's songs array
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}

		console.log("✅ Song created successfully:", song._id);
		res.status(201).json(song);
	} catch (error) {
		console.error("❌ Error in createSong:", error);
		res.status(500).json({ 
			message: "Failed to create song",
			error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
		});
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		const song = await Song.findById(id);

		// if song belongs to an album, update the album's songs array
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		console.log("💿 Creating new album...");
		console.log("Request body:", req.body);
		console.log("Files received:", req.files ? Object.keys(req.files) : "No files");

		const { title, artist, releaseYear } = req.body;
		
		// Validate required fields
		if (!title || !artist || !releaseYear) {
			return res.status(400).json({ 
				message: "Missing required fields: title, artist, releaseYear" 
			});
		}

		if (!req.files || !req.files.imageFile) {
			return res.status(400).json({ 
				message: "Please upload album cover image" 
			});
		}

		const { imageFile } = req.files;

		console.log("📤 Uploading album cover to Cloudinary...");
		const imageUrl = await uploadToCloudinary(imageFile);

		console.log("💾 Creating album in database...");
		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear: parseInt(releaseYear),
		});

		await album.save();

		console.log("✅ Album created successfully:", album._id);
		res.status(201).json(album);
	} catch (error) {
		console.error("❌ Error in createAlbum:", error);
		res.status(500).json({ 
			message: "Failed to create album",
			error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
		});
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
