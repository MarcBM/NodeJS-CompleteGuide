// Core Node Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
const bodyParser = require('body-parser');
// To use handlebars as an engine, we need to import it, since it doesn't auto-register with express by default.
// const expressHbs = require('express-handlebars');
// Custom Routes Modules
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Template Engines are very useful for injecting dynamic content into HTML files.
// We need to let Express know that we are using a templating engine. To do this we use app.set() to set a global config.
// We are specifically setting the 'view engine' config key.

// This first example uses pug. Since pug has inbuilt express compatability, it auto-registers itself with express.
// app.set('view engine', 'pug');

// The second example uses handlebars. Handlebars does not have auto-registering as a feature, so we must first register it as an engine.
// Whatever name we register it as must also be the file extension we use so that express can find the templates properly.
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set('view engine', 'hbs');

// The final example uses ejs. EJS is like pug, and is auto-registered with express.
app.set('view engine', 'ejs')

// We can also tell express where our views are stored. It needs to know for the template engine.
// Again, this is done with a global config. By default, we already have it correct, but let's be explicit.
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {docTitle: 'Page not Found'});
});

app.listen(3000);