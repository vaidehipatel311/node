const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
const { exec } = require('child_process');
const jsondata = require('../db/config/config.js');
const readline = require('readline');

const sequelize = new Sequelize(
    jsondata.development.database,
    jsondata.development.username,
    jsondata.development.password, {
    dialect: jsondata.development.dialect,
    logging: false
});

const SequelizeMeta = sequelize.define('SequelizeMeta', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'SequelizeMeta',
    timestamps: false
});

function checkMigrations(callback) {
    const migrationFiles = loadMigrations();

    try {
        SequelizeMeta.findAll({ raw: true }).then(executedMigrations => {
            const executedMigrationNames = executedMigrations.map(migration => migration.name.split('.')[0]);

            const pendingMigrations = migrationFiles.filter(file => !executedMigrationNames.includes(file));

            if (pendingMigrations.length > 0) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question(`There are pending migrations: ${pendingMigrations.join(', ')}.\n Do you want to run them? (Y/N): `, (answer) => {
                    rl.close();
                    if (answer.toLowerCase() === 'y' || answer === 'Y') {
                        exec('npx sequelize-cli db:migrate', (error, stdout) => {
                            if (error) {
                                console.error(`Error in running migrations: ${error.message}`);
                                return;
                            }
                            console.log(`Migrations executed successfully: ${stdout}`);
                            callback(true);
                        });
                    } else {
                        console.log('Exiting without running migrations.');
                        callback(true);
                    }
                });

            } else {
                console.log('All migrations are up to date.');
                callback(true);
            }
        })
    } catch (error) {
        console.error('Error loading migrations:', error);
        callback(false);
    }
}

function loadMigrations() {
    const migrationsPath = path.join(__dirname, '..', 'db', 'migrations');

    try {
        if (fs.existsSync(migrationsPath)) {
            const migrationsFiles = fs.readdirSync(migrationsPath);
            return migrationsFiles.map(file => path.basename(file, '.js'));
        } else {
            console.warn('Migrations folder not found.');
        }
    } catch (error) {
        console.warn('Error loading migrations:', error);
    }
    return [];
}

module.exports = {
    checkMigrations: checkMigrations
};