const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors")
const Route = require("./routes/route");
const Auth = require("./routes/auth");
const { connectDB } = require("./config/db");

const app = express();
const port = 3000;


// Secure API Key


app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // For parsing application/json (if needed elsewhere)
app.use(express.urlencoded({ extended: true }));
app.use(cors())


connectDB();

// Routes
app.get("/", (req, res) => {
    res.render("index", { recommendations: null });
});

app.use("/api", Route)
app.use("/api/auth", Auth)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
