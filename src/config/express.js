const path = require("path");
const cookieParser = require("cookie-parser");
const userRouter = require(path.join(process.cwd(),"src/modules/user/user.routes.js"));
const userStrategy = require(path.join(process.cwd(),"src/modules/user/user.strategy.js"));
const products = require(path.join(process.cwd(),"src/modules/product/product.routes.js"));

const express = require("express");

module.exports = async function () {
    const app = express();

    app.use(cookieParser("cookie_secret"));
    app.use(express.json());

    userRouter(app);
    products(app);
    userStrategy();

    app.get("/", (req, res) => {
        res.send("The server is running...");
    });

    return app;
};
