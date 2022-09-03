const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const router = require("express").Router()
const dotenv = require("dotenv")
dotenv.config()

const User = require("../models/user")
const validation = require("../handlers/validation")
//ユーザー新規登録API
router.post(
  "/register",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("username").custom(async (value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject("このユーザーは既に使われています")
      }
    })
  }),validation.validate,
  async (req, res) => {
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
)
module.exports = router
