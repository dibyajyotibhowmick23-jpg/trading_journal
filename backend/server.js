const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ================= MODEL =================
const TradeSchema = new mongoose.Schema({
  stock: String,
  pnl: Number,
  date: Date
});

const Trade = mongoose.model("Trade", TradeSchema);

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// GET all trades
app.get("/api/trades", async (req, res) => {
  const trades = await Trade.find();
  res.json(trades);
});

// ADD trade
app.post("/api/trades", async (req, res) => {
  const newTrade = new Trade(req.body);
  await newTrade.save();
  res.json(newTrade);
});

// DELETE trade
app.delete("/api/trades/:id", async (req, res) => {
  await Trade.findByIdAndDelete(req.params.id);
  res.json({ message: "Trade deleted" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});