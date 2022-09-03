const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.register = async (req, res) => {
  //パスワードの受け取り
  const password = req.body.password
  try {
    //パスワードの暗号化
    req.body.password = cryptoJS.AES.encrypt(password, process.env.SECRET_KEY)
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
}
