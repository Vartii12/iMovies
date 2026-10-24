const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const showRoutes = require("./routes/showRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const movieRoutes = require("./routes/movieRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
require("dotenv").config({ path: "./.env" });

// Prefer IPv4 results to avoid ::1 (IPv6) connections when providers expect IPv4
const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const { verifyTransport } = require("./utils/mailer");
const cron = require("node-cron");
const { sendReminderEmails } = require("./utils/reminderService");
const { cleanupOldBookings } = require("./utils/cleanupService");

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8000;
let mongoUri = process.env.MONGODB_CONNECTION_LINK || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Imovies";

const seedInitialData = async () => {
  try {
    const Movie = require("./models/movieModel");
    const Theatre = require("./models/theatreModel");
    const Show = require("./models/showModel");

    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log("Seeding sample movies and theatres...");
      const sampleMovies = await Movie.insertMany([
        {
          movieName: "Inception",
          description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          genres: ["Action", "Sci-Fi", "Thriller"],
          releaseDate: new Date("2024-07-16"),
          runtime: 148,
          certification: "UA",
          media: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60",
        },
        {
          movieName: "Interstellar",
          description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers.",
          genres: ["Adventure", "Drama", "Sci-Fi"],
          releaseDate: new Date("2024-11-07"),
          runtime: 169,
          certification: "U",
          media: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=60",
        },
        {
          movieName: "The Dark Knight",
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
          genres: ["Action", "Crime", "Drama"],
          releaseDate: new Date("2024-07-18"),
          runtime: 152,
          certification: "A",
          media: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=60",
        },
      ]);

      const theatre = await Theatre.create({
        theatreName: "PVR Cinemas IMAX",
        theatreId: "TH_001",
        location: "Downtown Mall, Screen 1",
        balconySeatPrice: 400,
        middleSeatPrice: 250,
        lowerSeatPrice: 150,
        balconySeats: { rows: 3, cols: 8 },
        middleSeats: { rows: 5, cols: 8 },
        lowerSeats: { rows: 3, cols: 8 },
      });

      // Add sample shows for the movies
      const generateSeats = (theatreDoc) => {
        const categories = ["balcony", "middle", "lower"];
        const tickets = {};
        categories.forEach((cat) => {
          tickets[cat] = {};
          const catConfig = theatreDoc[cat + "Seats"];
          const rows = catConfig.rows || 3;
          const cols = catConfig.cols || 8;
          const price = theatreDoc[cat + "SeatPrice"] || 200;

          for (let r = 1; r <= rows; r++) {
            const rowLetter = String.fromCharCode(64 + r);
            for (let c = 1; c <= cols; c++) {
              const seatId = `${cat[0].toUpperCase()}_${rowLetter}${c}`;
              tickets[cat][seatId] = {
                seatNumber: `${rowLetter}${c}`,
                category: cat,
                price: price,
                isBooked: false,
              };
            }
          }
        });
        return tickets;
      };

      for (const m of sampleMovies) {
        await Show.create({
          adminEmail: "admin@imovies.com",
          showId: `SHOW_${m.movieName.replace(/\s+/g, "_")}_1`,
          movieId: m.movieName,
          theatreName: theatre.theatreName,
          showdate: "2026-10-30",
          showtime: "18:30",
          tickets: generateSeats(theatre),
        });
        await Show.create({
          adminEmail: "admin@imovies.com",
          showId: `SHOW_${m.movieName.replace(/\s+/g, "_")}_2`,
          movieId: m.movieName,
          theatreName: theatre.theatreName,
          showdate: "2026-10-30",
          showtime: "21:30",
          tickets: generateSeats(theatre),
        });
      }
      console.log("Seeded default movies, theatres, and shows!");
    }
  } catch (err) {
    console.error("Seeding warning:", err.message);
  }
};

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log(" Connected to MongoDB successfully");
    await seedInitialData();
  } catch (error) {
    console.warn("⚠️ Local MongoDB instance not reachable:", error.message);
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      console.log("🚀 Starting embedded MongoDB Memory Server for seamless local execution...");
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri, {});
      console.log(" Connected to embedded MongoDB successfully!");
      await seedInitialData();
    } catch (memErr) {
      console.error("❌ Embedded MongoDB error:", memErr.message);
    }
  }
};

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

connectToMongo();

// Background cron tasks
cron.schedule("0 * * * *", () => {
  sendReminderEmails();
  cleanupOldBookings();
});

// Verify mailer transporter
verifyTransport();

// API Endpoints as specified
app.use("/api/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/review", reviewRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "iMovies API Server is running!", status: "active" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
