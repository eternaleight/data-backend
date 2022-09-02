const express = require("express")
const mongoose = require("mongoose")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const cryptoJS = require("crypt-js")
const User = require("./src/v1/models/user")

//DB接続
try {
  mongoose.connect(process.env.MONGODB_URL)
  console.log("DBと接続中")
} catch (error) {
  console.log(error)
}

app.get("/", (req,res) => {
  res.send("hello express")
})

//ユーザー新規登録API
app.post("/register", async(req,res) => {
  //パスワードの受け取り
  const password = req.body.password
  try {
    //パスワードの暗号化
    req.body.password = cryptoJS.AES.encrypt(password, process.env.SECRET_KEY)
    //パスワードの新規作成
    const user = await User.create(req.body)
  } catch {
  }
})

// app.put("/put"(req,res) => {
// })

// app.delete("/delete"(req,res) => {
// })

const PORT = 5001
app.listen(PORT, () => {
  console.log("localhost:" + PORT + "を起動中")
})
