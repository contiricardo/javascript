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
const totalCarrito = document.querySelector("#total")
const divCompra = document.querySelector("#compra")
const btnComprar = document.createElement("button")
const ver = document.getElementById("ver")
const verCarrito = document.querySelector("#verCarrito")
const search = document.querySelector("#search")
const chkNombre = document.querySelector("#chkNombre")
const chkDetalle = document.querySelector("#chkDetalle")
const ordMayor = document.querySelector("#mayorPrecio")
const ordMenor = document.querySelector("#menorPrecio")

/*********************************
*** Declaración de objetos
*********************************/
class clsProducto {
    constructor(nombre, detalle, stock, precio, img){
        this.codigo = parseInt(arrProductos.length + 1);
        this.nombre = nombre.toUpperCase();
        this.detalle = detalle;
        this.stock = stock;
        this.precio = precio == "" || precio == 0 ? precio = 0 : precio;
        this.img = img;
        //img == "" || img === "https://via.placeholder.com/300" ? this.img = "https://via.placeholder.com/300" : this.img = img;
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

/*        const miCantCarrito = document.createElement('div')
        miCantCarrito.classList.add('card-footer')
        const prodEnCarrito = document.createElement('small')
        prodEnCarrito.classList.add('text-body-secondary')
        prodEnCarrito.textContent = ``

/*
<div class="card-footer">
        <small class="text-body-secondary">Last updated 3 mins ago</small>
      </div>
*/

        // Insertamos
        miProdCardBody.appendChild(miProdImagen)
        miProdCardBody.appendChild(miProdTitle)
        miProdCardBody.appendChild(miProdPrecio)
        miProdCardBody.appendChild(miProdBoton)
        // miCantCarrito.appendChild(prodEnCarrito)
        // miProdCardBody.appendChild(miCantCarrito)
        miProd.appendChild(miProdCardBody)
        divProductos.appendChild(miProd)
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
            //<small class="text-body-secondary">Last updated 3 mins ago</small>
            // const prodEnCarrito = document.get
            // prodEnCarrito.classList.add('text-body-secondary')
            // prodEnCarrito.textContent = `Producto/s en carrito: ${encontrado.cantidad}`

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
        let nombreObjeto
        let objNombre = arrProductos.find(obj => obj.codigo === carrito.codigo)
        if (objNombre) {
            nombreObjeto = objNombre.nombre;
        }

        const miEstructura = document.createElement("li")
        miEstructura.classList.add('list-group-item', 'text-right', 'my-2')
        miEstructura.textContent = `${carrito.codigo} - ` + nombreObjeto + ` x ${carrito.cantidad}`

        const quitarProd = document.createElement("button")
        quitarProd.classList.add("btn", 'btn-outline-danger', 'btn-sm')
        quitarProd.textContent = "-"
        quitarProd.style.marginLeft = '5px';
        quitarProd.setAttribute ("codigo", carrito.codigo)
        quitarProd.addEventListener("click", quitarProducto)
        
        //miEstructura.appendChild(prod)
        miEstructura.appendChild(quitarProd)
        divCarrito.appendChild(miEstructura)
    })

    guardarLS(arrCarrito)

    if (arrCarrito.length>0){
        verCarrito.style.display = "flex"
        verCarrito.classList.add("col-3")
        
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

        totalCarrito.textContent = calcularTotal()    
    } else {
        verCarrito.style.display = "none"
        verCarrito.classList.remove("col-3")
    }

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


/*********************************
 * Calcula el precio total teniendo en cuenta los productos repetidos
*********************************/
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


/*********************************
 * Función de compra
*********************************/
let realizarCompra = () => {
    Swal.fire({
        title: 'Seguro quieres finalizar la compra?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Comprar',
        denyButtonText: `Seguir eligiendo`,
      }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
          Swal.fire('Su compra fue realizada con exito!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Serás redirigido nuevamente a la tienda!', '', 'warning')
}})
}

/*********************************
 * LocalStorage
*********************************/
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
    } else if (params === "detalle") {

        const detalleEnMayusculas = el["detalle"].toUpperCase();
        return detalleEnMayusculas.includes(filtro);

        //return el["detalle"].includes(filtro);
    }
  });
}

// ordenar
function ordenar(arr, ord) {
    if (ord === 1){
        return arr.sort((a, b)=> b.precio - a.precio)
    } else if (ord === 0) {
        return arr.sort((a, b)=> a.precio - b.precio)
    }
}


/*********************************
*** carga inicial
*********************************/

if(localStorage.getItem("carrito")){
    arrCarrito = JSON.parse(localStorage.getItem("carrito"))
}

fetch('./data/db.json')
    .then(response=>response.json())
    .then(data=>{
        data.forEach((prd)=>{
            arrProductos.push(new clsProducto(prd.nombre, prd.detalle, prd.stock, prd.precio, prd.img));
        })
        renderProductos(data)
        renderCarrito()
})


//Listeners de búsqueda
let tipoFiltro
search.addEventListener("input", () => {
    if (chkNombre.checked){
        tipoFiltro = "nombre"
    } else if (chkDetalle.checked){
        tipoFiltro = "detalle"
    }
    let nuevoFiltro = filtrar(arrProductos, tipoFiltro, search.value.toUpperCase())
    renderProductos(nuevoFiltro)
});

ordMayor.addEventListener("click", () => {
    let nuevoFiltro = ordenar(arrProductos, 1)
    renderProductos(nuevoFiltro)
})

ordMenor.addEventListener("click", () => {
    let nuevoFiltro = ordenar(arrProductos, 0)
    renderProductos(nuevoFiltro)
})

