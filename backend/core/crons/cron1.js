const cron = require("node-cron");

function myCron1() {

    cron.schedule("*/5 * * * * *", function () {
        let data = `${new Date()} : Server is working\n`;
        console.log(data);
    });
}

module.exports = {
    myCron1: myCron1
};
