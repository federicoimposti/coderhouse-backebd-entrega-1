const express = require('express');
const productsRouter = express.Router();

const controller = require('../controllers/products');
const productos = new controller('./volumes/products.txt');

const error = { error: 'Producto no encontrado' };

productsRouter.get("/", (req, res) => {
  productos.getAll()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
        console.log('ocurrió un error al obtener los productos.', err);
    })
  });

  productsRouter.get("/:id", (req, res) => {
    const productId = parseInt(req?.params?.id);

    productos.getById(productId)
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al obtener el producto.', err);
      })
  });

  productsRouter.delete("/:id", (req, res) => {
    const productId = parseInt(req?.params?.id);

    productos.deleteById(productId)
      .then(response => {
        res.status(202).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al eliminar el producto.', err);
      })
  });

  productsRouter.post("/", (req, res) => {
    productos.save(req.body)
      .then(response => {
        res.status(201).send(response);
      })
      .catch(err => {
          console.log('ocurrió un error al guardar el producto.', err);
      })
  });

  productsRouter.put("/:id", (req, res) => {
    const productId = parseInt(req?.params?.id);
    
    productos.update(productId, req.body)
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        console.log('ocurrió un error al modificar el producto.', err);
      })
  });

module.exports = productsRouter;