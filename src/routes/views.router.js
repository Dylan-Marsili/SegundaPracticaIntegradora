// routes/views.router.js
import { Router } from 'express';
import ProductModel from '../models/Product.js';
import CartModel from '../models/Cart.js';

const viewsRouter = Router();

// GET /products
viewsRouter.get('/products', async (req, res, next) => {
  try {
    const { limit, page, query, sort } = req.query;
    const perPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;

    const skip = (currentPage - 1) * perPage;

    let queryObject = {};
    if (query) {
      queryObject = { $or: [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }] };
    }

    let sortObject = {};
    if (sort) {
      sortObject = { price: sort === 'asc' ? 1 : -1 };
    }

    const totalProducts = await ProductModel.countDocuments(queryObject);
    const totalPages = Math.ceil(totalProducts / perPage);

    const products = await ProductModel.find(queryObject).lean()
      .skip(skip)
      .limit(perPage)
      .sort(sortObject)
      .exec();

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const prevLink = hasPrevPage
      ? `/products?page=${currentPage - 1}&limit=${perPage}&query=${query}&sort=${sort}`
      : null;
    const nextLink = hasNextPage
      ? `/products?page=${currentPage + 1}&limit=${perPage}&query=${query}&sort=${sort}`
      : null;

    res.render('products', {
      products,
      totalPages,
      currentPage,
      prevPage: currentPage - 1,
      nextPage: currentPage + 1,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    next(error);
  }
});



// GET /products/:pid
viewsRouter.get('/products/:pid', async (req, res, next) => {
  try {
    const pid = req.params.pid;

    const cart = await CartModel.create({ products: [] });

    const product = await ProductModel.findById(pid).lean();

    if (product) {
      // Renderizar la vista con el cartId
      res.render('product-details', { product, cartId: cart._id });
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// GET /carts/:cid
viewsRouter.get('/carts/:cid', async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cart = await CartModel.findById(cid).populate('products.product', '-_id -__v');

    if (cart) {
      res.render('cart', { cart });
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (error) {
    next(error);
  }
});

export default viewsRouter;
