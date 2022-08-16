const express = require('express');
const carritoRouter = express.Router();

const controller = require('../controllers/cart');
const carrito = new controller('./volumes/cart.txt');

const error = { error: 'carrito no encontrado' };

carritoRouter.get("/", (req, res) => {
  carrito.getAll()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
        console.log('ocurrió un error al obtener los carrito.', err);
    })
  });

  carritoRouter.get("/:id/productos", (req, res) => {
    const cartId = parseInt(req?.params?.id);

    carrito.getProductsInCart(cartId)
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al obtener el carrito.', err);
      })
  });

  carritoRouter.delete("/:id", (req, res) => {
    const cartId = parseInt(req?.params?.id);

    carrito.deleteById(cartId)
      .then(response => {
        res.status(202).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al eliminar el carrito.', err);
      })
  });

  carritoRouter.delete("/:id/productos/:id_prod", (req, res) => {
    const cartId = parseInt(req?.params?.id);
    const productId = parseInt(req?.params?.id_prod);

    carrito.deleteByIdCartAndIdProduct(cartId, productId)
      .then(response => {
        res.status(202).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al eliminar el producto del carrito.', err);
      })
  });

  carritoRouter.post("/", (req, res) => {
    carrito.save(req.body)
      .then(response => {
        res.status(201).send(response);
      })
      .catch(err => {
          console.log('ocurrió un error al guardar el carrito.', err);
      })
  });

  carritoRouter.post("/:id/productos", (req, res) => {
 
    const cartId = parseInt(req?.params?.id);

    carrito.saveProductInCart(req.body, cartId)
      .then(response => {
        res.status(201).send(response);
      })
      .catch(err => {
          console.log('ocurrió un error al guardar el carrito.', err);
      })
  });

  carritoRouter.put("/:id", (req, res) => {
    const cartId = parseInt(req?.params?.id);
    
    carrito.update(cartId, req.body)
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al modificar el carrito.', err);
      })
  });

module.exports = carritoRouter;