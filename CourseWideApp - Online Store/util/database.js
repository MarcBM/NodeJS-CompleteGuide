// Capital S for Sequelize to show that we are importing Sequelize as a class.
const Sequelize = require('sequelize');
// Lowercase s for sequelize as we are instantiating a new sequelize object.
const sequelize = new Sequelize('node-complete', 'root', '-K@WK3YJFD6o*Y2_Ue6y', {
    dialect: 'mysql',
    host: 'localhost'
});
// Remember to export the sequelize object, so that we can use it in app.js.
module.exports = sequelize;