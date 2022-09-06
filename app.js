// create an express app
const express = require("express")
const app = express()
const http = require("https")
const server = http.createServer(app)
const io = require('socket.io')(server);






// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

// start the server listening for requests
app.listen(process.env.PORT || 2095, 
	() => console.log("Server is running..."));








