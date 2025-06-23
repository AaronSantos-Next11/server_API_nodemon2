const bd = require ('../../BD/mysqlv2')

const TABLA = 'luces'

function todos (){
    return bd.todos(TABLA)
}

function uno (id){
    return bd.uno(TABLA, id)
}

async function agregar(body) {

    const nuevo_dispositivo = {
        id: body.id,
        nombre_dispositivo: body.nombre_dispositivo,
        status: body.status,
        lugar: body.lugar
    }

    return bd.agregar_dispositivo(TABLA, nuevo_dispositivo) // Llama la función "agregar" desde ../../BD/mysqlv2mysql2.js
}

function eliminar (body){
    return bd.eliminar(TABLA,body)
}

// Midleware para "Luces"

function actualizar_status(body) {
    return bd.actualizar_status(TABLA, body);
}

module.exports={
    todos,
    uno,
    agregar,
    eliminar, 
    actualizar_status
}