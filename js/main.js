/*********************************
*** Variables Globales
*********************************/
const arrProductos = []
let arrCarrito = []

/*********************************
*** Componentes 
*********************************/
// items productos y busqueda
const divProductos = document.querySelector("#productos")
const search = document.querySelector("#search")
const chkNombre = document.querySelector("#chkNombre")
const chkDetalle = document.querySelector("#chkDetalle")
const ordMayor = document.querySelector("#mayorPrecio")
const ordMenor = document.querySelector("#menorPrecio")

// items de carrito
const btnCart = document.querySelector('.container-cart-icon')
const containerCartProducts = document.querySelector('.container-cart-products')
// lista de productos en el carrito de compra
const rowProduct = document.querySelector('.row-product')
// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items')
// Variable para el valor final de la compra
const valorTotal = document.querySelector('.total-pagar')
// Variable para el total de productos
const countProducts = document.querySelector('#contador-productos')
// Carrito vacio
const cartEmpty = document.querySelector('.cart-empty')
// Valor total visualización
const cartTotal = document.querySelector('.cart-total')
// Cruz para eliminar producto del carrito
const iconClose = document.querySelector('icon-close')
// Botón de vaciar carrito
const btnVaciarCarrito = document.querySelector('#vaciarCarrito')
// Botón para realizar la compra
const btnRealizarCompra = document.querySelector('#btnRealizarCompra')


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
        return this.stock == 0 ? "Sin stock" : "Agregar"
    }
    sumarStock(){
        this.stock += 1;
    }
    restarStock(){
        // console.log(this.verStock())
        // this.stock -= 1;
        const indice = arrProductos.findIndex(prod => prod.codigo === this.codigo);
        if (indice !== -1) {
            console.log(this.stock)
        } else {
            console.log("El producto no existe en la lista.");
        }
    }
}

class clsCarrito {
    constructor(codigo, cantidad){
        this.codigo = parseInt(codigo)
        this.cantidad = parseInt(cantidad)
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
       // Caja
        const vBloque = document.createElement('div')
        vBloque.classList.add('col')
        // Caja
        const vCaja = document.createElement('div')
        vCaja.classList.add('card', 'h-100')
        // Imagen
        const vImagen = document.createElement('img');
        vImagen.classList.add('card-img-top');
        vImagen.setAttribute('src', prd.img)
        // Contenido de información del producto
        const vInfoProd = document.createElement('div')
        vInfoProd.classList.add('card-body')
        // Nombre del producto
        const vTituloProd = document.createElement('h5');
        vTituloProd.classList.add('card-title');
        vTituloProd.textContent = prd.nombre;
        // Detalle del producto
        const vDetalleProd = document.createElement('p')
        vDetalleProd.classList.add('card-text', 'fs-6', 'fw-light')
        vDetalleProd.textContent = prd.detalle
        // Contenedor
        const vPrecioBoton = document.createElement('div')
        vPrecioBoton.classList.add('d-flex','justify-content-evenly', 'mb-3')
        // Precio
        const vPrecioProd = document.createElement('p')
        vPrecioProd.classList.add('card-text','fs-5', 'fw-normal')
        vPrecioProd.textContent = `$ ${prd.precio}`
        // Boton 
        const vBotonAgregar = document.createElement('button')
        vBotonAgregar.classList.add('btn', 'btn-sm', 'fw-bolder')
        if (prd.stock === 0) {
            vBotonAgregar.classList.add('disabled', 'btn-outline-secondary')
            vBotonAgregar.classList.remove('btn-outline-primary')
            vBotonAgregar.textContent = 'Sin stock'
        } else {
            vBotonAgregar.classList.remove('disabled', 'btn-outline-primary')
            vBotonAgregar.classList.add('btn-outline-primary')
            vBotonAgregar.textContent = 'Agregar'
        }

        vBotonAgregar.setAttribute('marcador', prd.codigo)
        vBotonAgregar.setAttribute('nombre', prd.nombre)
        vBotonAgregar.addEventListener('click', anyadirProductoAlCarrito)
        vBotonAgregar.addEventListener('click', muestraProdAgregado)
        
        // Agregar producto a la vista
        vInfoProd.appendChild(vTituloProd)
        vInfoProd.appendChild(vDetalleProd)
        vPrecioBoton.appendChild(vBotonAgregar)
        vPrecioBoton.appendChild(vPrecioProd)
        vCaja.appendChild(vImagen)
        vCaja.appendChild(vInfoProd)
        vCaja.appendChild(vPrecioBoton)
        vBloque.appendChild(vCaja)
        divProductos.appendChild(vBloque)
    });
}

/*********************************
*** Funciones del carrito
*********************************/
function renderCarrito () {
	if (!arrCarrito.length) {
		cartEmpty.classList.remove('hidden')
		rowProduct.classList.add('hidden')
		cartTotal.classList.add('hidden')
        btnVaciarCarrito.classList.add('hidden')
	} else {
		cartEmpty.classList.add('hidden')
		rowProduct.classList.remove('hidden')
		cartTotal.classList.remove('hidden')
        btnVaciarCarrito.classList.remove('hidden')
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';
    
	arrCarrito.forEach((product) => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

        let objNombre = arrProductos.find(obj => obj.codigo === product.codigo)

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span id="cod-prod" class="hidden">${product.codigo}</span>
                <span class="cantidad-producto-carrito">${product.cantidad}</span>
                <span class="titulo-producto-carrito">${objNombre.nombre}</span>
                <span class="precio-producto-carrito">${objNombre.precio}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon-close"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        `;

		rowProduct.append(containerProduct);
	})
    
    guardarLS(arrCarrito)
	valorTotal.innerText = `$${calcularTotal()}`
	countProducts.innerText = cantidadProductos()
}

// Agregar al carrito
function anyadirProductoAlCarrito(evento){
    const newProdId = parseInt(evento.target.getAttribute('marcador'))
    
    if (arrCarrito.length > 0){
        let existe = arrCarrito.some((el)=>{ 
            return el.codigo == newProdId 
        })
        if (existe){
            let encontrado = arrCarrito.find((el) => { 
                return el.codigo == newProdId 
            })
            encontrado.cantidad++
        } else {
            arrCarrito.push(new clsCarrito(newProdId, 1))
        }
    } else {
        arrCarrito.push(new clsCarrito(newProdId, 1))
    }

    let pos = arrProductos.findIndex(prod => prod.codigo === newProdId);
    arrProductos[pos].stock -= 1
    
    // Actualizamos el carrito 
    renderCarrito()
    renderProductos(arrProductos)
}

// Quitar producto del carrito
function quitarProducto(val){
    let elementoAQuitar = parseInt(val)

    let existe = arrCarrito.some((el) => el.codigo == elementoAQuitar)
    if (existe){
        let quitar = arrCarrito.find((el) => el.codigo == elementoAQuitar)
        quitar.cantidad > 0 && quitar.cantidad--

        if (quitar.cantidad == 0) {
            const indice = arrCarrito.findIndex(prod => prod.codigo === elementoAQuitar)
            indice !== -1 && arrCarrito.splice(indice, 1)
        }
    }
    let pos = arrProductos.findIndex(prod => prod.codigo === elementoAQuitar);
    arrProductos[pos].stock += 1
    
    renderCarrito()
    renderProductos(arrProductos)
}

// Vaciar el carrito
function cerrarVaciarCarrito (){
    Swal.fire({
        title: 'Seguro quieres vaciar el carrito?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Vaciar',
        denyButtonText: `No`,
        }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito()
        } 
    })
}
// cantidad de productos
function cantidadProductos() {
    // Recorremos el array del carrito y sumamos la cantidad total de productos
    return arrCarrito.reduce((cantTotal, item) => {
        return cantTotal + item.cantidad
    }, 0).toFixed(0);
}
// Calculo de total
function calcularTotal() {
    // Recorremos el array del carrito 
    return arrCarrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = arrProductos.filter((prd) => {
            return prd.codigo === parseInt(item.codigo)
        });
        // Los sumamos al total
        return total + (miItem[0].precio * item.cantidad)
    }, 0).toFixed(2);
}

// Devuelve los productos y vacia el carrito
function vaciarCarrito() {
    arrCarrito.forEach((arr) => {
        let pos = arrProductos.findIndex(prod => prod.codigo === arr.codigo);
        arrProductos[pos].stock += arr.cantidad
    })

    arrCarrito.length = 0
    renderCarrito()
    renderProductos(arrProductos)
}
// Funciónes de botones del carrito
btnVaciarCarrito.addEventListener('click', () => {
    cerrarVaciarCarrito()
})

// Visualización del carrito
btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart')
})

// evento para quitar producto del carrito
rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const codProd = product.querySelector('#cod-prod').textContent;

        quitarProducto(codProd)
        renderCarrito()
	}
})


/*********************************
 * Función de compra
*********************************/
btnRealizarCompra.addEventListener("click", ()=>{
    realizarCompra()
})

const realizarCompra = () => {
    Swal.fire({
        title: 'Seguro quieres finalizar la compra?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Comprar',
        denyButtonText: `Seguir eligiendo`,
      }).then((result) => {
        if (result.isConfirmed) {
            finalizarCompra()
            Swal.fire('Su compra fue realizada con exito!', '', 'success')
        } else if (result.isDenied) {
            Swal.fire('Serás redirigido nuevamente a la tienda!', '', 'warning').then((result) => {
                window.location.replace("./index.html#sProductos")})
    }})
}

const finalizarCompra = () => {
    arrCarrito.length = 0
    renderCarrito()
    renderProductos(arrProductos)
}

/*********************************
*** Filtros y busquedas
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
    }
  });
}

// ordenar
function ordenar(arr, ord) {
    if (ord === 1){
        return arr.sort((a, b)=> b.precio - a.precio)
    } else if (ord === 0) {
        return arr.sort((a, b)=> a.precio - b.precio)
    } else if (ord === 3) {
        return arr.sort((a, b)=> {
            const nombreA = a.nombre.toUpperCase()
            const nombreB = b.nombre.toUpperCase()
            if (nombreA < nombreB){ return -1 }
            if (nombreA > nombreB){ return 1 }
            return 0
        })
    } else if (ord === 4) {
        return arr.sort((a, b)=> {
            const detalleA = a.detalle.toUpperCase()
            const detalleB = b.detalle.toUpperCase()
            if (detalleA < detalleB){ return -1 }
            if (detalleA > detalleB){ return 1 }
            return 0
        })
    }

}

//Listeners de búsqueda
let tipoFiltro
chkNombre.addEventListener("click", () => {
    let nuevoFiltro = ordenar(arrProductos, 3)
    search.value = ''
    renderProductos(nuevoFiltro)
})

chkDetalle.addEventListener("click", () => {
    let nuevoFiltro = ordenar(arrProductos, 4)
    search.value = ''
    renderProductos(nuevoFiltro)
})

ordMayor.addEventListener("click", () => {
    let nuevoFiltro = ordenar(arrProductos, 1)
    search.value = ''
    renderProductos(nuevoFiltro)
})

ordMenor.addEventListener("click", () => {
    let nuevoFiltro = ordenar(arrProductos, 0)
    search.value = ''
    renderProductos(nuevoFiltro)
})

search.addEventListener("input", () => {
    if (chkNombre.checked){
        tipoFiltro = "nombre"
    } else if (chkDetalle.checked){
        tipoFiltro = "detalle"
    }
    let nuevoFiltro = filtrar(arrProductos, tipoFiltro, search.value.toUpperCase())
    renderProductos(nuevoFiltro)
})



/*********************************
*** carga inicial
*********************************/

// LocalStorage
function guardarLS(arr) {
    localStorage.setItem("carrito", JSON.stringify(arr));
}

if(localStorage.getItem("carrito")){
    arrCarrito = JSON.parse(localStorage.getItem("carrito"))
}

// Carga de productos por promesa
fetch('./data/db.json')
    .then(response=>response.json())
    .then(data=>{
        data.forEach((prd)=>{
            arrProductos.push(new clsProducto(prd.nombre, prd.detalle, prd.stock, prd.precio, prd.img));
        })
        renderProductos(data)
        renderCarrito()
})

// función de aviso de selección de producto
function muestraProdAgregado (evento){
    let prod = evento.target.getAttribute('nombre')
    Toastify({
        text: `Producto ${prod} agregado`,
        duration: 1500,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #204d22, #20ba25)",
        }
    }).showToast();
}
