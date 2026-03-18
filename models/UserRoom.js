const mongoose = require("mongoose");

const userRoomsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rooms: { type: [String], default: [] }
});

module.exports = mongoose.model("UserRooms", userRoomsSchema);
