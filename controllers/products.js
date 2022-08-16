const fs = require('fs');
const error = { error: 'Producto no encontrado' };

module.exports = class Controller {
    constructor(file) {
        this.file = file;
    }

    async save(obj) {
        try {
            const products = await this.getAll();

            if (!products || !products.length) {
                obj.id = 1;
                await fs.promises.writeFile(this.file, JSON.stringify([obj], null, 2));

                return obj.id.toString();
            }

            const lastProduct = products.slice(-1);
            obj.id = parseInt(lastProduct[0]?.id) + 1;
            obj.timestamp = Date.now();
            
            const addProduct = [...products, obj];
            await fs.promises.writeFile(this.file, JSON.stringify(addProduct, null, 2));

            return obj.id.toString();
        } catch (err) {
            throw new Error('Ocurrió un error al guardar el archivo.', err);
        }
    }

    async getById(id) {
        try {
            const products = await this.getAll();

            if (!products) {
                return error;
            }

            const product = products.find(product => product.id === id);
            return product ? product : error;
        } catch (err) {
            throw new Error('Ocrrió un error obteniendo el producto.', err);
        }
    }

    async getAll() {
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8');
            return products ? JSON.parse(products) : null;
        } catch(err) {
            throw new Error('Ocurrió un error obteniendo los productos.', err);
        }
    }

    async deleteById(id) {
        try {
            const products = await this.getAll();

            if (!products) {
                return;
            }

            const productsFiltered = products.filter(product => product.id !== id);
            await fs.promises.writeFile(this.file, JSON.stringify(productsFiltered, null, 2));
        } catch (err) {
            throw new Error('Ocurrió un error eliminando el producto.', err);
        }
        
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([], null, 2));
        } catch (err) {
            throw new Error ('Ocurrió un error eliminando los productos.', err);
        }
        
    }

    async update(id, newData) {
        try {
            const { title, price, thumbnail } = newData;
            const productId = id;

            const product = await this.getById(productId);
            const products = await this.getAll();
        
            if(product?.id){
                products.forEach(product => {
                    const id = product.id;
                    if(productId === id){
                        product.title = title;
                        product.price = price;
                        product.thumbnail = thumbnail;
                    }
                });

            await fs.promises.writeFile(this.file, JSON.stringify(products, null, 2));
            } else {
                return error;
            }
        } catch (err) {
            throw new Error ('Ocurrió un error actualizando el producto.', err);
        }
      };
}
