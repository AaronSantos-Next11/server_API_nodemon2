const bd = require ('../../BD/mysqlv2')

const TABLA = 'usuario'

function todos (){
    return bd.todos(TABLA)
}

function uno (id){
    return bd.uno(TABLA, id)
}

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Puedes usar 10 como nivel de complejidad


async function agregar (body){
 const hashedPassword = await bcrypt.hash(body.pw, SALT_ROUNDS);
    const nuevoUsuario={
        id:body.id,
        nombre:body.nombre,
        email:body.email,
        pw:hashedPassword,
        status:body.status
    }
    return bd.agregar(TABLA, nuevoUsuario)
}

function eliminar (body){
    return bd.eliminar(TABLA,body)
}
function login (body){
    return bd.login(TABLA,body)
}
module.exports={
    todos,uno,agregar,eliminar,login
}