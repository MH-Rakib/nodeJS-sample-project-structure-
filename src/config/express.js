const path = require("path");
const users = require(path.join(process.cwd(),"src/modules/user/user.routes.js"));
const userStrategy = require(path.join(process.cwd(),"src/modules/user/user.strategy.js"));
const products = require(path.join(process.cwd(),"src/modules/product/product.routes.js"));

const express = require("express");

module.exports = async function () {
    const app = express();

    app.use(express.json());

    users(app);
    products(app);
    userStrategy();

    app.get("/", (req, res) => {
        res.send("The server is running...");
    });

    return app;
};
