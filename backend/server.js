const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- CONNECT MONGODB ---------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch((err) => {
  console.log("❌ MongoDB Error:", err);
});

/* ---------------- MODEL ---------------- */
const TradeSchema = new mongoose.Schema({
  stock: String,
  pnl: Number,
  date: Date
});

const Trade = mongoose.model("Trade", TradeSchema);

/* ---------------- ROUTES ---------------- */

// GET all trades
app.get("/api/trades", async (req, res) => {
  const trades = await Trade.find();
  res.json(trades);
});

// ADD trade
app.post("/api/trades", async (req, res) => {
  const newTrade = new Trade({
    stock: req.body.stock,
    pnl: req.body.pnl,
    date: new Date()
  });

  await newTrade.save();
  res.json(newTrade);
});

// DELETE trade
app.delete("/api/trades/:id", async (req, res) => {
  await Trade.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ---------------- SERVER ---------------- */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});