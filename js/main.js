'use strict'
// Variables Globales
const vProductos = []
const vCarrito = []

let productoSeleccionado
let cantidadProducto
let hacerCompra
let claveFija = "1234"

/* Declaración de objetos */
class producto {
    constructor(nombre, detalle, stock, precio){
        this.codigo = parseInt(vProductos.length + 1);
        this.nombre = nombre.toUpperCase();
        this.detalle = detalle;
        this.stock = stock;
        this.precio = precio;
    }
    verStock(){
        return this.stock
    }
    restarStock(cant){
        return this.stock -= cant
    }
    sumarStock(cant){
        return this.stock += cant
    }
    cambiarNombre(nvoNombre){
        this.nombre = nvoNombre
    }
    cambiarDetalle(nvoDetalle){
        this.detalle = nvoDetalle
    }
    cambiarPrecio(nvoPrecio){
        this.precio = parseFloat(nvoPrecio)
    }
    
}

class carrito {
    constructor(codigo, cantidad){
        this.codigo = parseInt(codigo);
        this.cantidad = parseInt(cantidad);
    }
    quitar(cant){
        return this.cantidad -= cant
    }
    agregar(cant){
        return this.cantidad += cant
    }
}

// Carga inicial de productos
vProductos.push(new producto("Vela madera 35mm", 'vela en cuenco de madera de 35mm de diametro.', 40, 2500))
vProductos.push(new producto("Vela madera 50mm", 'vela en cuenco de madera de 50mm de diametro.', 50, 3300))
vProductos.push(new producto("Vela madera 80mm", 'vela en cuenco de madera de 80mm de diametro.', 25, 3900))
vProductos.push(new producto("Vela madera 95mm", 'vela en cuenco de madera de 95mm de diametro.', 33, 4500))
vProductos.push(new producto("Vela madera 110mm",'vela en cuenco de madera de 110mm de diametro.',10, 5200))
vProductos.push(new producto("Vela lata 35mm",   'vela en cuenco de lata de 50mm de diametro.',   37, 3500))
vProductos.push(new producto("Vela lata 80mm",   'vela en cuenco de lata de 80mm de diametro.',   48, 4200))
vProductos.push(new producto("Vela lata 95mm",   'vela en cuenco de lata de 50mm de diametro.',   25, 5100))
vProductos.push(new producto("Vela lata 110mm",  'vela en cuenco de lata de 110mm de diametro.',  33, 5800))
vProductos.push(new producto("Vela vidrio 35mm", 'vela en cuenco de vidrio de 35mm de diametro.', 60, 3100))
vProductos.push(new producto("Vela vidrio 50mm", 'vela en cuenco de vidrio de 50mm de diametro.', 80, 3500))
vProductos.push(new producto("Vela vidrio 80mm", 'vela en cuenco de vidrio de 80mm de diametro.', 50, 4200))
vProductos.push(new producto("Vela vidrio 95mm", 'vela en cuenco de vidrio de 95mm de diametro.', 10, 5300))
vProductos.push(new producto("Vela vidrio 110mm",'vela en cuenco de vidrio de 110mm de diametro.', 5, 6500))

// Listar productos.
const listarArray = (arr) => {
    let val = ""
    for (const obj of arr){
        val += `${obj.codigo} - Nombre producto ${obj.nombre}, precio: $ ${obj.precio} \n`
    }
    return val
}

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
        return el[params].includes(filtro);
    }
  });
}


// Visualización del carrito, combinado con el precio
const verCarrito = (arr)=>{
    let res = ""
    let total = 0
    console.log("Código  |  Cantidad  |  Monto \n")
    for (const listCarrito of arr){
        let bPrecio = buscarPorCodigo(vProductos, listCarrito.codigo)
        let valor = listCarrito.cantidad * bPrecio.precio
        total += valor
        res += `${listCarrito.codigo} | ${listCarrito.cantidad} | ${valor} \n`
    }
    console.log(res)
    console.log(total)
}


// Función de selección de producto.
function cargarProductos (){
    let seguir, vecFiltro, vFiltrar, filtro
    do{
        vecFiltro = vProductos
        vFiltrar = parseInt(prompt("Desea filtrar los prodcutos? \n 1- Por código \n 2- Por nombre \n 3- Por mayor precio \n 4- por menor precio \n 0- Ver todos."));
        
        if (vFiltrar == 1) {
            filtro = parseInt(prompt("Ingrese el código del producto."));
            vecFiltro = filtrar(vProductos, "codigo", filtro);
        } else if (vFiltrar == 2){
            filtro = prompt("Ingrese el nombre del producto a buscar.");
            vecFiltro = filtrar(vProductos, "nombre", filtro)
        }else if (vFiltrar == 3){
            vecFiltro = vProductos.sort(((a, b) => b.precio - a.precio))
            console.log(listarArray(vecFiltro))
        }else if (vFiltrar == 4){
            vecFiltro = vProductos.sort(((a, b) => a.precio - b.precio))
            console.log(listarArray(vecFiltro))
        }

        //productoSeleccionado = parseInt(prompt("Seleccione el/los producto/s que desea comprar \n " + listarArray(vProductos)));
        productoSeleccionado = parseInt(prompt("Seleccione el/los producto/s que desea comprar \n " + listarArray(vecFiltro)));
        cantidadProducto = parseInt(prompt("Ingrese la cantidad de productos a comprar \n "));

        let encontrado = buscarPorCodigo(vCarrito, productoSeleccionado)
        //let encontrado = vCarrito.some((el) => el.codigo === productoSeleccionado)
        if (encontrado != undefined){
            encontrado.agregar(cantidadProducto)
        }else {
            vCarrito.push(new carrito(productoSeleccionado, cantidadProducto))
        }
        
        let ver = parseInt(prompt("Desea ver el carrito de compras? \n 1- Ver carrito. \n 2- Continuar"))
        
        if (ver == 1) {
            verCarrito(vCarrito)
        }


        seguir = prompt('Desea elegir otro producto? S/N');
    }while(seguir == 'S' || seguir == 's')
}



// Inicio del proceso
alert("Bienvenido a BeraDeco. \nSeleccione los productos luego ingrese su clave para comprar.")

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


