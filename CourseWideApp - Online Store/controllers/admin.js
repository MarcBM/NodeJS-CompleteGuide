const Product = require('../models/product');

// Get AddProduct - Used in routes/admin.js.
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: "Add Product",
        path: '/admin/add-product',
        editing: false
    });
};

// Post AddProduct - Used in routes/admin.js.
exports.postAddProduct = (req, res, next) => {
    // Here we save the product to our file.
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    // The .create() method is provided by Sequelize allowing us to instantiate an object following the pattern
    // outlined in the model. It also posts it to the associated table in the db. You can use .build() instead
    // if you wish to split these two steps up.
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
        .then(result => {
            // console.log(result);
            console.log('Created Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// Get EditProduct - Used in routes/admin.js.
// This used the same sequelize syntax as getProduct() in controllers/shop.js.
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId).then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: "Edit Product",
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    // We first need to find the product in the database by its id.
    Product.findByPk(prodId)
    // We then update the product with the new values. Note that this will only change local values at this stage, not the database values.
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;
            // To save the updated product, we call save() on the product object.
            // To avoid nesting promises, we return the product.save() promise, and append another .then to our current tree.
            return product.save()
        })
        .then(result => {
            console.log('Updated Product!');
            // The page redirection is placed inside the then() block to make sure the page renders with the new values. This does mean that we are not doing any redirection if an error occurs, but we will look at that in a future module of the course.
            res.redirect('/admin/products');
        })
        .catch(err => confirmor.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

// This method will use similar syntax to the postEditProduct() method above.
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Deleted Product!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}