const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const dotenv = require("dotenv")
dotenv.config()

exports.register = async (req, res) => {
  //パスワードの受け取り
  const password = req.body.password
  try {
    //パスワードの暗号化
    req.body.password = cryptoJS.AES.encrypt(password, process.env.SECRET_KEY)
    //パスワードの新規作成
    const user = await User.create(req.body)
    // {"user": {
    //     "username": "eternaleight",
    //     "password": "U2FsdGVkX18ePcvewerc1lpwgLgDrkj0mggOeNbgf2M=",
    //     "confirmPassword"
    //     "_id": "631368fcc57d30e44aa33913",
    //     "__v": 0
    // },
    // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMTM2OGZjYzU3ZDMwZTQ0YWEzMzkxMyIsImlhdCI6MTY2MjIxNjQ0NCwiZXhwIjoxNjYyMzAyODQ0fQ.9wWgTtzTjelii7sHoES3LE5Z3XhdS2PUOPLs8LAIAso"
    // }
    //JWTの発行
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    })
    return res.status(200).json({ user, token })
  } catch (err) {
    return res.status(500).json(err)
  }
}

//ユーザーログイン用API
exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    //DBからユーザーが存在するか探してくる
    const user = await User.findOne({ username: username })
    if (!user) {
      return res.status(401).json({
        errors: {
          param: "username",
          message: "ユーザー名が無効です",
        },
      })
    }
    //パスワードが合っているか照合する
    const descryptedPassword = cryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(cryptoJS.enc.Utf8)
    if (descryptedPassword !== password) {
      return res.status(401).json({
        errors: {
          param: "password",
          message: "パスワードが無効です",
        },
      })
    }
    //JWTを発行
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    })
    return res.status(201).json({ user, token })
  } catch (err) {
    return res.status(500).json(err)
  }
}
