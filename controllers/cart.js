const fs = require('fs');
const error = { error: 'Carrito no encontrado' };

module.exports = class Controller {
    constructor(file) {
        this.file = file;
    }

    async save(obj) {
        try {
            const carts = await this.getAll();

            if (!carts || !carts.length) {
                obj.id = 1;
                await fs.promises.writeFile(this.file, JSON.stringify([obj], null, 2));

                return obj.id;
            }

            const lastCart = carts.slice(-1);
            obj.id = parseInt(lastCart[0]?.id) + 1;
            obj.timestamp = Date.now();
            obj.productos = [];
            
            const addCart = [...carts, obj];
            await fs.promises.writeFile(this.file, JSON.stringify(addCart, null, 2));

            return obj.id.toString();
        } catch (err) {
            throw new Error('Ocurrió un error al guardar el archivo.', err);
        }
    }

    async saveProductInCart(obj, id) {
        try {
            const carts = await this.getAll();
            const cart = carts.find(cart => cart.id === id);

            if (!cart) {
                return error;
            }

            obj.timestamp = Date.now();
            obj.id = id;
            
            const cartsWithNewProduct = carts.map(cartItem => {
                if(cartItem.id === obj.id) {
                    const products = cartItem.productos;
                    const addProductToCart = [...products, obj];
                    return cartItem.productos = addProductToCart;
                }
            });

            await fs.promises.writeFile(this.file, JSON.stringify(cartsWithNewProduct, null, 2));

            return obj.id.toString();
        } catch (err) {
            throw new Error('Ocurrió un error al guardar el archivo.', err);
        }
    }

    async getAll() {
        try {
            const carts = await fs.promises.readFile(this.file, 'utf-8');
            return carts ? JSON.parse(carts) : null;
        } catch(err) {
            throw new Error('Ocurrió un error obteniendo los carritos.', err);
        }
    }

    async getById(id) {
        try {
            const carts = await this.getAll();

            if (!carts) {
                return error;
            }

            const cart = carts.find(cart => cart.id === id);
            return cart ? cart : error;
        } catch (err) {
            throw new Error('Ocrrió un error obteniendo el carrito.', err);
        }
    }

    async getProductsInCart(id) {
        try {
            const cart = await this.getById(id);
            const productsInCart = cart.productos;

            if(!productsInCart.length){
                return error;
            }

            return productsInCart ? JSON.parse(productsInCart) : null;
        } catch(err) {
            throw new Error('Ocurrió un error obteniendo los carritos.', err);
        }
    }

    async deleteById(id) {
        try {
            const carts = await this.getAll();

            if (!carts) {
                return;
            }

            const cartsFiltered = carts.filter(cart => cart.id !== id);
            await fs.promises.writeFile(this.file, JSON.stringify(cartsFiltered, null, 2));
        } catch (err) {
            throw new Error('Ocurrió un error eliminando el carrito.', err);
        }
        
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([], null, 2));
        } catch (err) {
            throw new Error ('Ocurrió un error eliminando los carritos.', err);
        }
        
    }

    async update(id, newData) {
        try {
            const { title, price, thumbnail } = newData;
            const cartId = id;

            const cart = await this.getById(cartId);
            const carts = await this.getAll();
        
            if(cart?.id){
                carts.forEach(cart => {
                    const id = cart.id;
                    if(cartId === id){
                        cart.title = title;
                        cart.price = price;
                        cart.thumbnail = thumbnail;
                    }
                });

            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));
            } else {
                return error;
            }
        } catch (err) {
            throw new Error ('Ocurrió un error actualizando el carrito.', err);
        }
      };
}
