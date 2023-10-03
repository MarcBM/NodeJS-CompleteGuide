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
    // Using MongoDB, we are back to instantiating a new product object.
    const product = new Product(title, price, description, imageUrl);
    // Now we can just call the save() method on the product object.
    product
        .save()
        .then(() => {
            console.log('Created Product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// Get EditProduct - Used in routes/admin.js.
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
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

    // We no longer need to find the product in the database by its ID, since we have all the data we need to recreate it, and use our product model method to save the updated product to the same place in the database.
    // ======================================================================================
    // This is important to internalise, since the db call is never going to actually give us a functional product model object as we have defined. All the db stores is the data within that model, not any methods, so when it returns it to us, all we get is a JSON object represtation of the product data.
    // ======================================================================================
    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        prodId
    );

    // Now we can just call save() on our new product object. Since it already has an id, the save method will update the existing document, rather than creating a new one.
    // We first need to find the product in the database by its id.
    product
        .save()
        .then(() => {
            console.log('Updated Product!');
            // The page redirection is placed inside the then() block to make sure the page renders with the new values. This does mean that we are not doing any redirection if an error occurs, but we will look at that in a future module of the course.
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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

// This method is mostly implemented within the product model itself.
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}