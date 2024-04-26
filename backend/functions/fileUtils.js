const fs = require('fs');


function readJSONFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const jsonData = data.toString();
                    resolve(jsonData);
                    console.log(jsonData);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

module.exports = { readJSONFile };
