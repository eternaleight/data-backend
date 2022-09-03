const router = require("express").Router()
const dotenv = require("dotenv")
dotenv.config()
const { body } = require("express-validator")
const userController = require("../controllers/user")

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
  }),
  validation.validate,
  userController.register
)

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
)

module.exports = router
