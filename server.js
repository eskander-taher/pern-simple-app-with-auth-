const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT = 10;
const SECRET = "secert";

const express = require("express");
const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("running");
});

app.post("/register", async (req, res) => {
	try {
		const { name, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, SALT);

		const newUser = await prisma.user.create({
			data: {
				name,
				password: hashedPassword,
			},
		});

		res.send({ success: true, user: newUser });
	} catch (error) {
		res.send({ success: false, error });
	}
});

app.post("/login", async (req, res) => {
	const { name, password } = req.body;
	const user = await prisma.user.findUnique({
		where: {
			name,
		},
	});

	if (user) {
		const checkPass = await bcrypt.compare(password, user.password);

		if (checkPass) {
			const token = generateJwtToken(user);
			res.json({ token });
		} else {
			res.json({ message: "user not authorized" });
		}
	} else {
		res.json({ message: "user not found" });
	}
});

app.get("/profile", authMiddleware, (req, res) => {
	res.json({ message: "Authorized access to profile", user: req.user });
});

function authMiddleware(req, res, next) {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).json({ message: "Unauthorized: No token provided" });
	}

	jwt.verify(token, SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: "Unauthorized: Invalid token" });
		}

		req.user = decoded;
		next();
	});
}

function generateJwtToken(payload) {
	try {
		const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
		return token;
	} catch (error) {
		console.error("Error generating JWT token:", error);
		throw error;
	}
}

app.listen(3000, () => console.log("server running"));
