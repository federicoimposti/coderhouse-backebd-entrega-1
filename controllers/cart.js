const fs = require('fs');
const error = { error: 'Carrito no encontrado' };

module.exports = class Controller {
    constructor(file) {
        this.file = file;
    }

    async save() {
        try {
            const carts = await this.getAll();

            const cart = {
                timestamp: Date.now(),
                productos: []
            }

            if (!carts || !carts.length) {
                cart.id = 1;
                await fs.promises.writeFile(this.file, JSON.stringify([cart], null, 2));

                return cart.id.toString();
            }

            const lastCart = carts.slice(-1);

            cart.id = parseInt(lastCart[0]?.id) + 1

            const addCart = [...carts, cart];
            await fs.promises.writeFile(this.file, JSON.stringify(addCart, null, 2));

            return cart.id.toString();
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
            
            carts.forEach(cartItem => {
                if(cartItem.id == id) {
                    cartItem.productos.push(obj);
                }
            });

            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));

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

            if(!productsInCart?.length){
                return error;
            }

            return productsInCart ?? null;
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

    async deleteByIdCartAndIdProduct(cartId, productId) {
        try {
            const productIdFormatted = parseInt(productId);
            const carts = await this.getAll();
            const cart = carts.find(cart => cart.id === cartId);

            if (!cart) {
                return error;
            }
            
            const cartsFiltered = carts.map(cartItem => {
                if(cartItem.id == cartId) {
                    const productsFiltered = cartItem.productos.filter(product => product.id != productIdFormatted );
                    const cartFiltered = {
                        timestamp: cartItem?.timestamp,
                        id: cartItem?.id,
                        products: productsFiltered,
                    }

                    return cartFiltered;
                }

                return cartItem ? cartItem : [];
            });

            await fs.promises.writeFile(this.file, JSON.stringify(cartsFiltered, null, 2));
        } catch (err) {
            throw new Error('Ocurrió un error al guardar el archivo.', err);
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
