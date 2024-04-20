const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {

    async findByCategory(req, res, next) {
        try {
            const id_category = req.params.id_category; // CLIENTE
            const data = await Product.findByCategory(id_category);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error al listar los productos por categoria`,
                success: false,
                error: error
            });
        }
    },
    
    async findByCategoryAndProductName(req, res, next) {
        try {
            const id_category = req.params.id_category; // CLIENTE
            const product_name = req.params.product_name; // CLIENTE
            const data = await Product.findByCategoryAndProductName(id_category, product_name);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error al listar los productos por categoria`,
                success: false,
                error: error
            });
        }
    },

    async create(req, res, next) {

        let product = JSON.parse(req.body.product);
        console.log(`Producto ${JSON.stringify(product)}`);

        const files = req.files;

        let inserts = 0;
        
        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen',
                success: false
            });
        }
        else {
            try {
                console.log(files);
                
                const data = await Product.create(product); // ALMACENANDO LA INFORMACION
                product.id = data.id;

                

                const start = async () => {
                     await asyncForEach(files, async (file) => {
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(file, pathImage);
                        console.log(url);
                        if(url == null){
                            product.image1 = "https://imgv3.fotor.com/images/side/generate-cat-dog-and-birds-with-fotor-random-animal-generator.jpg";
                        }
                        console.log(`url: ${url}`);
                        if (url !== undefined && url !== null) {
                            if (inserts == 0) { // IMAGEN 1
                                product.image1 = url;
                            }
                            else if(inserts == 1) { // IMAGEN 2
                                product.image2 = url;
                            }
                            else if(inserts == 2) { // IMAGEN 3
                                product.image3 = url;
                            }
                        }

                        await Product.update(product);
                        inserts = inserts + 1;

                        if (inserts == files.length) {
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        }

                     }); 

                }

                start();

            } 
            catch (error) {
                console.log(`Error: ${error}`);
                return res.status(501).json({
                    message: `Error al registrar el producto ${error}`,
                    success: false,
                    error: error
                });
            }
        }

    }

}