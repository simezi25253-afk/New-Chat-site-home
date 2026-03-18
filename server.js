const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserRooms = require("./models/UserRooms");
require("dotenv").config();

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (home site)"))
  .catch(err => console.log(err));

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

  // 参加済みルームを取得
  let userRooms = await UserRooms.findOne({ userId });

  if (!userRooms) {
    // 初回アクセスなら空のデータを作る
    userRooms = await UserRooms.create({
      userId,
      rooms: ["123456789"] // 仮で1つ入れておく
    });
  }

  res.render("home", {
    username,
    rooms: userRooms.rooms
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Home site running"));
