const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2]; // Module name provided as a command line argument

if (!moduleName) {
    console.error('Please provide a module name');
    process.exit(1);
}

const modulePath = path.join(__dirname, '.', 'api', moduleName);

// Create the module folder
fs.mkdirSync(modulePath);

// Create the services and functions folders inside the module folder
fs.mkdirSync(path.join(modulePath, 'services'));
fs.mkdirSync(path.join(modulePath, 'functions'));
fs.mkdirSync(path.join(modulePath, 'controllers'));
// fs.appendFile(modulePath, 'routes.json');


console.log(`Module '${moduleName}' created successfully`);
