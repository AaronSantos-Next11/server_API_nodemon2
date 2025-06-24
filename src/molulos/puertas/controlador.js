const bd = require ('../../BD/mysqlv2')

const TABLA = 'puertas'

function todos (){
    return bd.todos(TABLA)
}

function uno (id){
    return bd.uno(TABLA, id)
}

async function agregar(body) {

    const nueva_puerta = {
        id: body.id,
        nombre_puerta: body.nombre_puerta,
        status: body.status,
        lugar: body.lugar
    }

    return bd.agregar_puerta(TABLA, nueva_puerta) // Llama la función "agregar" desde ../../BD/mysqlv2mysql2.js
}

function eliminar (body){
    return bd.eliminar(TABLA,body)
}

function actualizar_status(body) {
    return bd.actualizar_status_puerta(TABLA, body);
}

module.exports={
    todos,
    uno,
    agregar,
    eliminar, 
    actualizar_status
}