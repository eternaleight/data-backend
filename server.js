const express = require("express")
const mongoose = require("mongoose")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const cryptJS = require("crypt-js")
const User = require("./src/v1/models/user")
const jwt = require("jsonwebtoken")

app.use(express.json())

//DB接続
try {
  mongoose.connect(process.env.MONGODB_URL)
  console.log("DBと接続中")
} catch (error) {
  console.log(error)
}


//ユーザー新規登録API
app.post("/register", async(req, res) => {
  //パスワードの受け取り
  const password = req.body.password
  try {
    //パスワードの暗号化
    req.body.password = cryptJS.AES.encrypt(password, process.env.SECRET_KEY)
    //パスワードの新規作成
    const user = await User.create(req.body)
    //JWTの発行
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    })
    return res.status(200).json({ user, token })
  } catch (err) {
    return res.status(500).json(err)
  }
})

// app.put("/put"(req,res) => {
// })

// app.delete("/delete"(req,res) => {
// })
app.get("/", (res) => {
  res.send("hello express")
})

const PORT = 5001
app.listen(PORT, () => {
  console.log("localhost:" + PORT + "を起動中")
})
