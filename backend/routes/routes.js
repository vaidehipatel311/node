module.exports = app => {
    const Demo = require("../controllers/controller");

    var router = require("express").Router();


    router.get("/queries", Demo.queries);
    console.log('qqq');

    router.post("/create", Demo.create);

    app.use('/', router);
};