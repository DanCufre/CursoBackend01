import fs from 'fs';

class productManager {

    constructor() {
        this.path = "./temp";
        this.file = "/products.txt"
        this.fileName = this.path + this.file;
        this.products = [];
    }
    // indice para ID de codigo de producto
    static idIndex = 0;

    //  Funcion para validar existencia de producto en base el codigo del producto
    #valExistProduct(code) {
        if (fs.existsSync(this.fileName)) {
            let contenido = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
            if (contenido.find((contenido) => contenido.code === code)) {
                return 1;
            }
        }
        return 0;
    }
    // elimino archivo por corridas anterioes
    inicializo() {
        // borro archivo existente
        if (fs.existsSync(this.fileName)) {
            try {
                fs.unlinkSync(this.fileName);
                console.log(`Archivo borrado: ${this.fileName}`)
            } catch (err) {
                console.error(`Error al borrar archivo ${this.fileName}`, err);
            }
        }
    }
    // carga de datos actuales 
    getProducts() {
        if (fs.existsSync(this.fileName)) {
            let contenido = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
            this.products = contenido;
            return this.products
        }
    }

    // agregar nuevo producto
    addProduct(title, description, price, thumbnail, code, stock) {
        // funcion para validar datos nulos
        let validar = (campo, dato) => {
            if (dato === null) {
                console.log(`Debe especificar un dato para ${campo}`)
                return "NOOK";
            }
            return "OK"
        }
        //valido los campos que no sean nulos
        if (validar("title", title) != 'OK') return;
        if (validar("description", description) != 'OK') return;
        if (validar("price", price) != 'OK') return;
        if (validar("thumbnail", thumbnail) != 'OK') return;
        if (validar("code", code) != 'OK') return;
        if (validar("stock", stock) != 'OK') return;

        // valido que no se repita un codigo de producto
        if (this.#valExistProduct(code) === 1) {
            console.log(`El codigo de producto indicado ${code} ya existe`)
            return;
        }

        // sino existe carpeta la creo
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
        // incremento secuencia de id de prodcuto
        productManager.idIndex++

        // agrego en array
        this.products.push({ title, description, price, thumbnail, code, stock, id: productManager.idIndex });

        // persisto los datos
        let contenidoGrabar = JSON.stringify(this.products, null, 2, '\t');
        fs.writeFileSync(this.fileName, contenidoGrabar);
    }

    // busco producto por id de mismo 
    getProductById(idCodigo) {
        if (fs.existsSync(this.fileName)) {
            let contenido = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
            this.products = contenido;
            if (this.products.find((producto) => producto.id === idCodigo)) { return this.products.find(({ id }) => id === idCodigo); }
            else {
                return "Not found";
            }
        }
    }

    updateProduct(idCodigo, DatosCambiar) {
        if (fs.existsSync(this.fileName)) {
            let contenido = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
            let contador = 0;
            this.products = contenido;
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === idCodigo) {
                    this.products[i].title = DatosCambiar[i].title
                    this.products[i].description = DatosCambiar[i].description
                    this.products[i].price = DatosCambiar[i].price
                    this.products[i].thumbnail = DatosCambiar[i].thumbnail
                    this.products[i].code = DatosCambiar[i].code
                    this.products[i].stock = DatosCambiar[i].stock
                    break;
                }
            };
            // persisto los datos
            let contenidoGrabar = JSON.stringify(this.products, null, 2, '\t');
            fs.writeFileSync(this.fileName, contenidoGrabar);
        }

    }

    deleteProduct(idCodigo) {
        if (fs.existsSync(this.fileName)) {
            let contenido = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
            let contador = 0;
            this.products = contenido;
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === idCodigo) {
                    contador = i;
                    break;
                }
            };
            this.products.splice(contador, 1);
            // persisto los datos
            let contenidoGrabar = JSON.stringify(this.products, null, 2, '\t');
            fs.writeFileSync(this.fileName, contenidoGrabar);
        }
    }

    // carga de datos actuales 
    getProductsAsync = async () => {
        if (!fs.existsSync(this.fileName)) {
            console.error('Archivo Inexistente');
            throw error('El archivo no se puede leer porque no existe: ' || this.fileName)
        }
        let contenido = await fs.promises.readFile(this.fileName, "utf8");
        this.products = JSON.parse(contenido);
    }
}

export default productManager;
