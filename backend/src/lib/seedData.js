import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const seedData = async () => {
	try {
		// Check if data already exists
		const songCount = await Song.countDocuments();
		const albumCount = await Album.countDocuments();

		if (songCount > 0 && albumCount > 0) {
			console.log("Database already has data, skipping seed...");
			return;
		}

		console.log("Seeding database with initial data...");

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// Create all songs
		const createdSongs = await Song.insertMany([
			{
				title: "Stay With Me",
				artist: "Sarah Mitchell",
				imageUrl: "/cover-images/1.jpg",
				audioUrl: "/songs/1.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 46, // 0:46
			},
			{
				title: "Midnight Drive",
				artist: "The Wanderers",
				imageUrl: "/cover-images/2.jpg",
				audioUrl: "/songs/2.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 41, // 0:41
			},
			{
				title: "Lost in Tokyo",
				artist: "Electric Dreams",
				imageUrl: "/cover-images/3.jpg",
				audioUrl: "/songs/3.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 24, // 0:24
			},
			{
				title: "Summer Daze",
				artist: "Coastal Kids",
				imageUrl: "/cover-images/4.jpg",
				audioUrl: "/songs/4.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 24, // 0:24
			},
			{
				title: "Neon Lights",
				artist: "Night Runners",
				imageUrl: "/cover-images/5.jpg",
				audioUrl: "/songs/5.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 36, // 0:36
			},
			{
				title: "Mountain High",
				artist: "The Wild Ones",
				imageUrl: "/cover-images/6.jpg",
				audioUrl: "/songs/6.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 40, // 0:40
			},
			{
				title: "City Rain",
				artist: "Urban Echo",
				imageUrl: "/cover-images/7.jpg",
				audioUrl: "/songs/7.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
			},
			{
				title: "Electric Pulse",
				artist: "Bass Drop",
				imageUrl: "/cover-images/8.jpg",
				audioUrl: "/songs/8.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 31, // 0:31
			},
			{
				title: "Retro Vibes",
				artist: "Synth Wave",
				imageUrl: "/cover-images/9.jpg",
				audioUrl: "/songs/9.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 33, // 0:33
			},
			{
				title: "Ocean Breeze",
				artist: "Chill Zone",
				imageUrl: "/cover-images/10.jpg",
				audioUrl: "/songs/10.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 35, // 0:35
			},
			{
				title: "Urban Jungle",
				artist: "City Lights",
				imageUrl: "/cover-images/15.jpg",
				audioUrl: "/songs/15.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 36, // 0:36
			},
			{
				title: "Neon Dreams",
				artist: "Cyber Pulse",
				imageUrl: "/cover-images/13.jpg",
				audioUrl: "/songs/13.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
			},
			{
				title: "Digital Love",
				artist: "Tech House",
				imageUrl: "/cover-images/14.jpg",
				audioUrl: "/songs/14.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 42, // 0:42
			},
			{
				title: "Skyline",
				artist: "Metro Beats",
				imageUrl: "/cover-images/11.jpg",
				audioUrl: "/songs/11.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 38, // 0:38
			},
			{
				title: "Midnight Express",
				artist: "Dark Wave",
				imageUrl: "/cover-images/12.jpg",
				audioUrl: "/songs/12.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 44, // 0:44
			},
			{
				title: "Cosmic Journey",
				artist: "Space Echoes",
				imageUrl: "/cover-images/16.jpg",
				audioUrl: "/songs/16.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 41, // 0:41
			},
			{
				title: "Neon Highway",
				artist: "Future Funk",
				imageUrl: "/cover-images/17.jpg",
				audioUrl: "/songs/17.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 37, // 0:37
			},
			{
				title: "Crystal Memories",
				artist: "Dream Pop",
				imageUrl: "/cover-images/18.jpg",
				audioUrl: "/songs/18.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 43, // 0:43
			},
		]);

		// Create albums with song references
		const albums = [
			{
				title: "Midnight Melodies",
				artist: "Various Artists",
				imageUrl: "/albums/1.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(0, 4).map((song) => song._id),
			},
			{
				title: "Urban Beats",
				artist: "Various Artists",
				imageUrl: "/albums/2.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(4, 8).map((song) => song._id),
			},
			{
				title: "Chill Vibes",
				artist: "Various Artists",
				imageUrl: "/albums/3.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(8, 12).map((song) => song._id),
			},
			{
				title: "Electronic Dreams",
				artist: "Various Artists",
				imageUrl: "/albums/4.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(12, 16).map((song) => song._id),
			},
		];

		// Insert all albums
		const createdAlbums = await Album.insertMany(albums);

		// Update songs with their album references
		for (let i = 0; i < createdAlbums.length; i++) {
			const album = createdAlbums[i];
			const albumSongs = albums[i].songs;

			await Song.updateMany(
				{ _id: { $in: albumSongs } }, 
				{ albumId: album._id }
			);
		}

		console.log(`✅ Database seeded successfully!`);
		console.log(`📀 Created ${createdSongs.length} songs`);
		console.log(`💿 Created ${createdAlbums.length} albums`);

	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	}
};
