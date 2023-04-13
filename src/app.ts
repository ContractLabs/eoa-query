import express from "express";
import { requestQuery, viewLinks } from "../services/api/request";

const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use("/api/submit", (req, res) => {
    const {signature, message} = req.body;
    requestQuery(message, signature);
    res.sendStatus(200);
});

app.use("/api/get-link", (req, res) => {
    const account = req.body.address;
    const data = viewLinks(account);
    res.status(200).json({
        message: 'Get link successfully!',
        data: data
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});


