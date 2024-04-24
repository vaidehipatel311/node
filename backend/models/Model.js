module.exports = (sequelize, Sequelize) => {
    const Demo = sequelize.define('Demo', {
        id: { type: Sequelize.INTEGER, primaryKey: true },
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        state: Sequelize.STRING,
    }, {
        timestamps: false
    });

    return Demo
}