const express = require("express");
const app = express();
const path = require("path");

const { sendEmail } = require("./emailCtrl");

const port = process.env.PORT || 3000;

app.use("/public", express.static(path.join(__dirname, "/public")));

app.get("/servicio-tecnico", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use(express.json());

app.post("/contact", sendEmail);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
