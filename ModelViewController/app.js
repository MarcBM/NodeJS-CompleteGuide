// Core Node Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
// Custom Routes Modules
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs')

app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: 'Page not Found'});
});

app.listen(3000);