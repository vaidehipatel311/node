const cron = require("node-cron");


function myCron2() {

    cron.schedule("*/10 * * * * *", function () {
        console.log('running myCron2() every 10 seconds');
    });
}

module.exports = {
    myCron2: myCron2
};