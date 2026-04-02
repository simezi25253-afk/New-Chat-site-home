const mongoose = require("mongoose");

const userRoomsSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  // 🔽 ここを拡張：rooms を「文字列の配列」→「オブジェクトの配列」に変更
  rooms: [
    {
      roomId: { type: String, required: true },
      roomName: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("UserRooms", userRoomsSchema);
