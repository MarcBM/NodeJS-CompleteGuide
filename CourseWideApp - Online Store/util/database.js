const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '-K@WK3YJFD6o*Y2_Ue6y', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;