const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserRooms = require("./models/UserRooms");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json()); // ← これがないとPOSTのJSONが受け取れない

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (home site)"))
  .catch(err => console.log(err));

// ▼▼▼ トップページ → /home に飛ばす ▼▼▼
app.get("/", (req, res) => {
  res.redirect("/home");
});
// ▲▲▲ ここまで ▲▲▲


// ▼▼▼ 追加：Make-room からルームを追加するAPI ▼▼▼
app.post("/api/addRoom", async (req, res) => {
  const { userId, roomId, roomName } = req.body;

  if (!userId || !roomId || !roomName) {
    return res.status(400).send("必要なデータが不足しています");
  }

  // ユーザーのルームデータを取得
  let userRooms = await UserRooms.findOne({ userId });

  // 初めてのユーザーなら作成
  if (!userRooms) {
    userRooms = new UserRooms({
      userId,
      rooms: []
    });
  }

  // すでに同じルームがあるかチェック
  const alreadyJoined = userRooms.rooms.some(r => r.roomId === roomId);

  if (!alreadyJoined) {
    userRooms.rooms.push({
      roomId,
      roomName,
      joinedAt: new Date()
    });
    await userRooms.save();
  }

  res.send("ルーム追加完了");
});
// ▲▲▲ ここまで追加 ▲▲▲


// ▼▼▼ Home ページ ▼▼▼
app.get("/home", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.send("トークンがありません。認証サイトからアクセスしてください。");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.send("トークンが無効です。ログインし直してください。");
  }

  const username = decoded.username;
  const userId = decoded.id;

  let userRooms = await UserRooms.findOne({ userId });

  if (!userRooms) {
    userRooms = await UserRooms.create({
      userId,
      rooms: []
    });
  }

  res.render("home", {
    username,
    rooms: userRooms.rooms
  });
});
// ▲▲▲ ここまで ▲▲▲


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Home site running"));
