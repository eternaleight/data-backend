const router = require("express").Router()
const dotenv = require("dotenv")
dotenv.config()
const { body } = require("express-validator")
const userController = require("../controllers/user")
const tokenHandler = require("../handlers/tokenHandler")

const User = require("../models/user")
const validation = require("../handlers/validation")
//http://localhost:5001/api/v1/auth/register

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
  }),
  validation.validate,
  userController.register
)

//JWT認証API
router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  return res.status(200).json({ user: req.user })
})

//ログイン用API
router.post(
  "/login",
  body("username")
    .isLength({ min: 8 })
    .withMessage("ユーザー名は8文字以上である必要があります"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  validation.validate,
  userController.login
)

module.exports = router
