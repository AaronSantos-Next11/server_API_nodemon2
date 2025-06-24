const mysql = require('mysql2/promise');
const config = require('../config');
const bcrypt = require('bcrypt');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let conexion;

// Función para conectar a MySQL con `mysql2`
async function conMysql() {
    try {
        conexion = await mysql.createConnection(dbconfig);
        console.log('BD conectada');    

        // Manejo de errores de conexión
        conexion.on('error', async (err) => {
            console.error('[BD ERROR]', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Conexión perdida. Reconectando...');
                await conMysql();
            } else {
                throw err;
            }
        });
    } catch (error) {
        console.error('[BD ERROR]', error);
        setTimeout(conMysql, 2000); // Reintento de conexión
    }
}

// Llamar a la conexión al inicio
conMysql();

// Función para obtener todos los registros de una tabla
async function todos(tabla) {
    const [result] = await conexion.query(`SELECT * FROM ${tabla}`);
    return result;
}

// Función para obtener un registro por ID
async function uno(tabla, id) {
    const [result] = await conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
    return result[0]; // Retornar solo el primer elemento
}

// Función para insertar un registro
async function insertar(tabla, data) {
    const [result] = await conexion.query(`INSERT INTO ${tabla} SET ?`, [data]);
    return result;
}

//* Función para actualizar un registro
async function actualizar(tabla, data) {
    const { id, ...datosActualizados } = data;
    const [result] = await conexion.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [datosActualizados, id]);
    return result;
}

async function agregar(tabla, data) {
    const id = parseInt(data.id);

    if (id === 0) {
        try {
            console.log('Validando email:', data.email);
            const [rows] = await conexion.query(`SELECT * FROM ${tabla} WHERE email = ?`, [data.email]);

            if (rows.length > 0) {
                console.log('Correo ya registrado');
                return { status: false, mensaje: 'El correo ya está registrado' };
            }

            const result = await insertar(tabla, data);
            return { status: true, resultado: result };

        } catch (error) {
            return { status: false, mensaje: 'Error al insertar el registro' };
        }
    } else {
        try {
            const result = await actualizar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            return { status: false, mensaje: 'Error al actualizar el registro' };
        }
    }
}


async function eliminar(tabla, id) {
    const [result] = await conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
    return result;
}

async function login(tabla, data) {
    const { user, password } = data;
    
    try {
        const [rows] = await conexion.query(
            `SELECT * FROM ?? WHERE email = ?`,
            [tabla, user]
        );
        
        /*  
        ! Cambia esta si quieres usar el nombre, embes del correo como "user"
        const [rows] = await conexion.query( `SELECT * FROM ?? WHERE nombre = ?`, [tabla, user]);
        */
       
       if (rows.length === 0) {
           return { status: false, mensaje: 'Usuario no encontrado' };
        }
        
        const usuarioBD = rows[0];
        const coincide = await bcrypt.compare(password, usuarioBD.pw);
        
        if (coincide) {
            return { status: true, user: usuarioBD };
        } else {
            return { status: false, mensaje: 'Contraseña incorrecta' };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { status: false, mensaje: 'Error del servidor' };
    }
}

//* Consultas de la carpeta "luces": 

async function agregar_dispositivo(tabla, data) {
    const id = parseInt(data.id);

    if (id === 0) {

        try {
            console.log('Agregando nuevo dispositivo:', data.nombre_dispositivo);

            //! Que no se te olvide la coma "," despues de la consulta
            const [rows] = await conexion.query(`SELECT * FROM ${tabla} WHERE nombre_dispositivo = ?`, [data.nombre_dispositivo]);

            if (rows.length > 0) {
                console.log('Dispositivo registrado');
                return { status: false, mensaje: 'El dispositivo ha sido registrado con exito' };
            }

            const result = await insertar(tabla, data);
            return { status: true, resultado: result };

        } catch (error) {
            console.error('Error al insertar dispositivo:', error); // Agregado para debugging
            return { status: false, mensaje: 'Error al insertar el registro' };
        }
        
    } else {
        try {
            const result = await actualizar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al actualizar dispositivo:', error); // Agregado para debugging
            return { status: false, mensaje: 'Error al actualizar el registro' };   
        }
    }

}

async function actualizar_status_dispositivo(tabla, data) {
    const { nombre_dispositivo, status } = data;
    
    try {
        // Verificar que el dispositivo existe
        const [rows] = await conexion.query(`SELECT * FROM ${tabla} WHERE nombre_dispositivo = ?`, [nombre_dispositivo]);
        
        if (rows.length === 0) {
            return { status: false, mensaje: 'Dispositivo no encontrado' };
        }
        
        // Actualizar solo el status del dispositivo
        const [result] = await conexion.query(
            `UPDATE ${tabla} SET status = ? WHERE nombre_dispositivo = ?`, 
            [status, nombre_dispositivo]
        );
        
        if (result.affectedRows > 0) {
            return { status: true, mensaje: 'Status actualizado correctamente', resultado: result };
        } else {
            return { status: false, mensaje: 'No se pudo actualizar el status' };
        }
        
    } catch (error) {
        console.error('Error al actualizar status:', error);
        return { status: false, mensaje: 'Error al actualizar el status del dispositivo' };
    }
}

async function agregar_puerta(tabla, data) {
    const id = parseInt(data.id);

    if (id === 0) {

        try {
            console.log('Agregando nueva puerta:', data.nombre_puerta);

            //! Que no se te olvide la coma "," despues de la consulta
            const [rows] = await conexion.query(`SELECT * FROM ${tabla} WHERE nombre_puerta = ?`, [data.nombre_puerta]);

            if (rows.length > 0) {
                console.log('Puerta registrada');
                return { status: false, mensaje: 'La puerta ha sido registrada con exito' };
            }

            const result = await insertar(tabla, data);
            return { status: true, resultado: result };

        } catch (error) {
            console.error('Error al insertar nueva puerta:', error); // Agregado para debugging
            return { status: false, mensaje: 'Error al insertar el registro' };
        }
        
    } else {
        try {
            const result = await actualizar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al actualizar la informacion de la puerta:', error); // Agregado para debugging
            return { status: false, mensaje: 'Error al actualizar el registro' };   
        }
    }
}

async function actualizar_status_puerta(tabla, data) {

    const { nombre_puerta, status } = data;
    
    try {
        // Verificar que la puerta existe
        const [rows] = await conexion.query(`SELECT * FROM ${tabla} WHERE nombre_puerta = ?`, [nombre_puerta]);
        
        if (rows.length === 0) {
            return { status: false, mensaje: 'La informacion de la puerta no ha sido encontrada' };
        }
        
        // Actualizar solo el status de la puerta
        const [result] = await conexion.query(
            `UPDATE ${tabla} SET status = ? WHERE nombre_puerta = ?`, 
            [status, nombre_puerta]
        );
        
        if (result.affectedRows > 0) {
            return { status: true, mensaje: 'Status actualizado correctamente', resultado: result };
        } else {
            return { status: false, mensaje: 'No se pudo actualizar el status' };
        }
        
    } catch (error) {
        console.error('Error al actualizar status:', error);
        return { status: false, mensaje: 'Error al actualizar el status de la puerta' };
    }
}

module.exports = {
    uno, 
    todos,
    agregar,
    eliminar, 
    login, 
    agregar_dispositivo,
    actualizar_status_dispositivo,
    agregar_puerta,
    actualizar_status_puerta
};