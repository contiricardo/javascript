/*********************************
*** Variables Globales
*********************************/
const arrProductos = []

let arrCarrito = []
let productoSeleccionado
let cantidadProducto
let hacerCompra
let claveFija = "1234"

/*********************************
*** Componentes 
*********************************/
const divProductos = document.querySelector("#productos")
const divCarrito = document.querySelector("#carrito")
const search = document.querySelector("#search")
const totalCarrito = document.querySelector("#total")
const divCompra = document.querySelector("#compra")
const btnComprar = document.createElement("button")

/*********************************
*** Declaración de objetos
*********************************/
class clsProducto {
    constructor(nombre, detalle, stock, precio, img){
        this.codigo = parseInt(arrProductos.length + 1);
        this.nombre = nombre.toUpperCase();
        this.detalle = detalle;
        this.stock = stock;
        //this.precio = precio;
        this.precio = precio == "" || precio == 0 ? precio = 0 : precio;
        //this.img = "img/" + img;
        img == "" ? this.img = "https://via.placeholder.com/150" : this.img = "img/" + img;
    }

    verStock(){
        return this.stock == 0 ? "Sin stock" : this.stock;
    }
    sumarStock(){
        this.stock += 1;
    }
    restarStock(){
        this.stock -= 1;
    }
}

class clsCarrito {
    constructor(codigo, cantidad){
        this.codigo = parseInt(codigo);
        this.cantidad = parseInt(cantidad);
    }
    quitar(){
        let res = this.cantidad > 0 ? this.cantidad -= 1 : this.cantidad = 0
        res == 0 && this.eliminar()
    }
    agregar(){
        return this.cantidad += 1;
    }
    eliminar() {
        const indice = arrCarrito.findIndex(prod => prod.codigo === this.codigo);
        if (indice !== -1) {
            arrCarrito.splice(indice, 1);
            console.log(`El producto con código ${this.codigo} ha sido eliminado.`);
        } else {
            console.log("El producto no existe en la lista.");
        }
    }
}

/*********************************
*** carga inicial
*********************************/
arrProductos.push(new clsProducto("Maceta diseño", 'Macetas de cemento con diseño', 40, 3200,"maceta_cemento_diseno.png"));
arrProductos.push(new clsProducto("Maceta cemento", 'Macetas de cemento clásica', 50, 2500,"maceta_cemento.png"));
arrProductos.push(new clsProducto("Vela madera 35mm", 'vela en cuenco de madera de 35mm de diametro.', 25, 3900,"vela_cuenco_madera_35mm.png"));
arrProductos.push(new clsProducto("Vela lata 35mm",   'vela en cuenco de lata de 35mm de altura.',   37, 3500,"vela_lata_35mm.jpg"));
arrProductos.push(new clsProducto("Vela lata 50mm",   'vela en cuenco de lata de 50mm de diametro.',   48, 4200,"vela_lata_50mm.png"));
arrProductos.push(new clsProducto("Vela lata 60mm",  'vela en cuenco de lata de 60mm de diametro.',  33, 5800,"vela_lata_60mm.png"));
arrProductos.push(new clsProducto("Vela vidrio redonda", 'vela en cuenco de vidrio redonda de 35mm de diametro.', 60, 3100,"vela_vidrio_redonda.jpeg"));
arrProductos.push(new clsProducto("Vela vidrio madera", 'vela en cuenco de vidrio de 50mm de diametro con tapa de madera.', 80, 3500,"vela_vidrio_tapa.png"));



/*********************************
*** Funciones de productos
*********************************/
function renderProductos (arr){
    divProductos.innerHTML = ""

    arr.forEach((prd) => {
        // Estructura
        const miProd = document.createElement('div');
        miProd.classList.add('card', 'col-md-4', 'col-sm-6');
        // Caja
        const miProdCardBody = document.createElement('div');
        miProdCardBody.classList.add('card-body');
        // Imagen
        const miProdImagen = document.createElement('img');
        miProdImagen.classList.add('img-fluid');
        miProdImagen.setAttribute('src', prd.img);
        // Titulo
        const miProdTitle = document.createElement('h5');
        miProdTitle.classList.add('card-title');
        miProdTitle.textContent = prd.nombre;
        // Precio
        const miProdPrecio = document.createElement('p');
        miProdPrecio.classList.add('card-text');
        miProdPrecio.textContent = `$ ${prd.precio}`;
        // Boton 
        const miProdBoton = document.createElement('button');
        miProdBoton.classList.add('btn', 'btn-primary');
        miProdBoton.textContent = '+';
        miProdBoton.setAttribute('marcador', prd.codigo);
        miProdBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miProdCardBody.appendChild(miProdImagen);
        miProdCardBody.appendChild(miProdTitle);
        miProdCardBody.appendChild(miProdPrecio);
        miProdCardBody.appendChild(miProdBoton);
        miProd.appendChild(miProdCardBody);
        divProductos.appendChild(miProd);
    });
}
// Función para agregar productos al carrito
function anyadirProductoAlCarrito(evento){
    const newProdId = parseInt(evento.target.getAttribute('marcador'));

    if (arrCarrito.length > 0){
        let existe = arrCarrito.some((el)=>{
            return el.codigo == newProdId;
        });
        if (existe){
            let encontrado = arrCarrito.find((el) => {
                return el.codigo == newProdId;
            });
            //encontrado.agregar();
            encontrado.cantidad += 1
        } else {
            arrCarrito.push(new clsCarrito(newProdId, 1))
        }
    } else {
        arrCarrito.push(new clsCarrito(newProdId, 1))
    }
    
    // Actualizamos el carrito 
    renderCarrito();
}

/*********************************
*** Funciones del carrito
*********************************/
function renderCarrito () {
    divCarrito.textContent = ""
    divCompra.textContent = ""
    totalCarrito.textContent = ""
    
    arrCarrito.forEach((carrito) => {
        let nombreObjeto;
        let objNombre = arrProductos.find(obj => obj.codigo === carrito.codigo);
        if (objNombre) {
            nombreObjeto = objNombre.nombre;
        }

        const miEstructura = document.createElement("li")
        miEstructura.classList.add('list-group-item', 'text-right', 'mx-2');
        miEstructura.textContent = `${carrito.codigo} - ` + nombreObjeto + ` x ${carrito.cantidad}`

        const quitarProd = document.createElement("button")
        quitarProd.classList.add("btn", "btn-secondary", "mx-5")
        quitarProd.textContent = " - "
        quitarProd.style.marginLeft = '5px';
        quitarProd.setAttribute ("codigo", carrito.codigo)
        quitarProd.addEventListener("click", quitarProducto)
        
        //miEstructura.appendChild(prod)
        miEstructura.appendChild(quitarProd)
        divCarrito.appendChild(miEstructura);
        
        
    })
    guardarLS(arrCarrito)

    if (arrCarrito.length>0){
        const clearCarrito = document.createElement("button")
        clearCarrito.classList.add("btn", "btn-danger", "m-2")
        clearCarrito.textContent = "Vaciar carrito"
        clearCarrito.addEventListener("click", vaciarCarrito)
        divCarrito.appendChild(clearCarrito)
        
        //const btnComprar = document.createElement("button")
        btnComprar.setAttribute("id","btnComprarSwal")
        btnComprar.classList.add("btn", "btn-success")
        btnComprar.textContent = "Realizar Compra"
        btnComprar.addEventListener("click", realizarCompra)
        divCompra.appendChild(btnComprar)
    }

    totalCarrito.textContent = calcularTotal()


}

function quitarProducto(evento){
    let elementoAQuitar = parseInt(evento.target.getAttribute("codigo"))

    let existe = arrCarrito.some((el) => el.codigo == elementoAQuitar)
    if (existe){
        let quitar = arrCarrito.find((el) => {
            return el.codigo == elementoAQuitar
        })
        //quitar.quitar()
        if (quitar.cantidad > 0){
            quitar.cantidad -= 1
        }
        if (quitar.cantidad == 0) {
            const indice = arrCarrito.findIndex(prod => prod.codigo === elementoAQuitar);
            if (indice !== -1) {
                arrCarrito.splice(indice, 1);
                console.log(`El producto con código ${elementoAQuitar} ha sido eliminado.`);
            }
        }
    }

    renderCarrito()
}


// Vaciar el carrito
function vaciarCarrito (){
    arrCarrito.length = 0
    
    renderCarrito()
}


/**
 * Calcula el precio total teniendo en cuenta los productos repetidos
**/
function calcularTotal() {
    // Recorremos el array del carrito 
    return arrCarrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = arrProductos.filter((prd) => {
            return prd.codigo === parseInt(item.codigo);
        });
        // Los sumamos al total
        return total + (miItem[0].precio * item.cantidad);
    }, 0).toFixed(2);
}


/**
 * Función de compra
**/
let realizarCompra = () => {
    Swal.fire({
        title: 'Seguro quieres finalizar la compra?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Comprar',
        denyButtonText: `Seguir eligiendo`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Su compra fue realizada con exito!', '', 'success')

        } else if (result.isDenied) {
          Swal.fire('Serás redirigido nuevamente a la tienda!', '', 'warning')
}})
}

/**
 * LocalStorage
**/
function guardarLS(arr) {
    localStorage.setItem("carrito", JSON.stringify(arr));
}

 

/*********************************
*** Filtros
*********************************/
const buscarPorCodigo = (arr, filtro) => {
    const val = arr.find((el) => el.codigo === filtro);
    return val;
}

// Función filtro
function filtrar(arr, params, filtro) {
  return arr.filter((el) => {
    if (params === "codigo") {
        return el.codigo == filtro;
    } else if (params === "nombre") {
        return el["nombre"].includes(filtro);
    }
  });
}



/*********************************
*** Inicio de logica
*********************************/
//alert("Bienvenido a BeraDeco. \nSeleccione los productos luego ingrese su clave para comprar.")

renderProductos(arrProductos)

if(localStorage.getItem("carrito")){
    arrCarrito = JSON.parse(localStorage.getItem("carrito"))
}

renderCarrito()

//Listeners de búsqueda
search.addEventListener("input", () => {
    let nuevoFiltro = filtrar(arrProductos, "nombre", search.value.toUpperCase())
    renderProductos(nuevoFiltro)
});


/*
cargarProductos()
//console.log(filtrar(vProductos, "MADERA", "nombre"));

// Realización de la compra con clave
hacerCompra = parseInt(prompt("Desea realizar la compra: \n 1. Comprar \n 2.Cancelar"))
if (hacerCompra === 1) {
    for (let x=3; x>0; x--){
        let clave = prompt("ingrese su clave. Tiene "+ x +" oportunidades")
        if (clave === claveFija){
            console.log("Realizaste la compra de \n")
            verCarrito(vCarrito)
            console.log("Gracias por su compra!")
            break
        }else{
            alert("Clave incorrecta!!")
            if(x==1){
                alert("La compra fue cancelada")
            }
        }
    }
} else {
    alert("Compra cancelada")
}
*/