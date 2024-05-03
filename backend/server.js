const express = require('express');
const { getServices } = require('./core/services.js');
const { getFunctions } = require('./core/functions.js');
const { getCrons } = require('./core/crons.js');
const { router, initializeServer } = require('./core/routes.js')
require('dotenv').config();
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const framework = {
    services: getServices(),
    functions: getFunctions(),
    crons: getCrons(),
};

global.framework = framework;

function createServer() {
    app.use(router);
    app.listen(8083, () => {
        console.log('Server is running on port 8083'.green);
    })
}

initializeServer(createServer);