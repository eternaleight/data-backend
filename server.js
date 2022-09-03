const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())
app.use("/api/v1", require("./src/v1/routes/auth"))

//DB接続
try {
  mongoose.connect(process.env.MONGODB_URL)
  console.log("DBと接続中")
} catch (error) {
  console.log(error)
}

const PORT = 5001
app.listen(PORT, () => {
  console.log("localhost:" + PORT + "を起動中")
})
