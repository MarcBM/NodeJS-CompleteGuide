// Here in the 'products' controller, we are going to place all of the logic that deals with products.
// All this logic already existed inside the routes files, but to avoid bloating them too much,
// we can place the logic here instead.

const Product = require('../models/product');

// Get Products data - Used in routes/shop.js.
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // The findById method is defined in the product model.
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// This method must be updated to use the new SQL cart model.
exports.getCart = (req, res, next) => {
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({productData: product, qty: cartProductData.qty});
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your Cart',
    //             products: cartProducts
    //         });
    //     })
    // })

    req.user
        .getCart()
        .then(cart => {
            // console.log(cart);
            // For some reason we are doing nested promoses here, not sure why.
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

// This method is used to add products to the cart, and must be rewritten to use the new SQL cart model.
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    // First we gain access to the user's cart. We also want to store this in the method scope so that we can access it inside some nested promises.
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            // Now we want to check if the product is already in the cart, if it is, we want to increment the quantity.
            return cart.getProducts({where: {id: prodId}});
        })
        .then (products => {
            // Now we have an array of products matching the product ID, which may be 1 or 0 items long.
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            // If product already exists, we access the product's CartItem and increment the quantity by 1.
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            // If product doesn't exist, we find it within the Product model, and add it to the cart.
            // We are using nested promises here, so that we can easily distinguish between the very different outcomes.
            return Product.findByPk(prodId);
        })
        .then(product => {
            // This addProduct method is created by sequelize when the many-to-many relationship is established. To make it work, we need to pass through an object to set the quantity since that is a column in the cartItem model.
            return fetchedCart.addProduct(product, {
                through: {quantity: newQuantity}
            });
        })
        // Once we have finished manipulating the cart, we would like to redirect the user to the cart.
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

// This method is used to remove products from the cart, and must be rewritten to use the new sequelize cart model.
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            // console.log(products);
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = {quantity: product.cartItem.quantity};
                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};