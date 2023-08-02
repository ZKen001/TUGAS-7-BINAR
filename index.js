const express = require("express");
const expressSession = require("express-session");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
var bodyParser = require('body-parser')
const PORT = 4000;

app.set("view engine", "ejs");
dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(
  expressSession({
    secret: "ewfewf",
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
app.post("/user/generateToken", (req, res) => {
	// Validate User Here
	// Then generate JWT Token

	let jwtSecretKey = process.env.JWT_SECRET_KEY;
	let data = {
		time: Date(),
		userId: 12,
	}

	const token = jwt.sign(data, jwtSecretKey);

	res.send(token);
});

// Verification of JWT
app.get("/user/validateToken", (req, res) => {
	// Tokens are generally passed in header of request
	// Due to security reasons.

	let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
	let jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const token = req.header(tokenHeaderKey);

		const verified = jwt.verify(token, jwtSecretKey);
		if(verified){
			return res.send("Successfully Verified");
		}else{
			// Access Denied
			return res.status(401).send(error);
		}
	} catch (error) {
		// Access Denied
		return res.status(401).send(error);
	}
});

require("./controllers")(app);


app.listen(PORT, () => {
  console.log("running at :" + PORT);
});

