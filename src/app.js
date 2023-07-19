import express from 'express';

//importo clase a usar
import products from './ProductManager.js';

// declaro express
const app = express();
const PORT = 8080;

let productos = new (products);

// Middleware
app.use(express.urlencoded({ extended: true }));

// endpoint
app.get('/saludo', (req, res) => {
    res.send("<h1>Hola desde el backend usando Express!!</h1>")
})

app.get('/products', (req, res) => {
    //tomamos datos de los parametros del request
    let datos = req.query;
    // hacemos un get de los productos guardados en el archivo
    let productosTodos = productos.getProducts();
    // evaluamos productos devueltos
    if (typeof productosTodos == 'undefined') {
        //muestro mensaje para cuando no tiene datos el archivo
        res.send("Archivo sin productos");
    }
    else {
        //limitamos los datos a devolver si el parametro limit lo indica o existe correctamente
        let { limit } = req.query;
        let salida = [];
        let limite = limit;
        //si el parametro limit existe limito la salida a mostrar
        if (limite >= 0) {
            let limiteLoop = limite;
            if (limite > productos.length) { limiteLoop = productos.legth }
            for (let i = 0; i < limiteLoop; i++) {
                salida.push(productos.products[i]);
            }
            res.send(salida);
        }
        else {
            //sino se indico limit muestro todos los productos
            res.send(productosTodos);
        }
    }
});

//para devolver solo el producto de id especificado
app.get('/products/:pid', (req, res) => {
    //tomo el parametro
    let { pid } = req.params;
    //seteo salida a mostrar
    let salida = []
    // hacemos un get de los productos guardados en el archivo
    let productosTodos = productos.getProducts();
    // evaluamos productos devueltos
    if (typeof productosTodos == 'undefined') {
        res.send("Archivo sin productos");
    }
    else {
        //buscamos el producto con id indicado en parametro
        const posicion = productosTodos.findIndex((u => u.id === parseInt(pid)));
        if (posicion >= 0) {
            //si encontro almaceno producto a mostrar
            salida = productosTodos[posicion]
        }
        //sino encontro muestro mensaje correspondiente
        else { salida = `No encontro producto para Id: ${pid}` }
        res.send(salida);
    }

});

// configuro puerto de escucha
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})
