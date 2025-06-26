const mysql = require('mysql2/promise');
const config = require('../config');
const bcrypt = require('bcrypt');

// Crear pool de conexiones
const pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para obtener todos los registros de una tabla
async function todos(tabla) {
    const [result] = await pool.query(`SELECT * FROM ${tabla}`);
    return result;
}

// Función para obtener un registro por ID
async function uno(tabla, id) {
    const [result] = await pool.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
    return result[0];
}

// Función para insertar un registro
async function insertar(tabla, data) {
    const [result] = await pool.query(`INSERT INTO ${tabla} SET ?`, [data]);
    return result;
}

// Función para actualizar un registro
async function actualizar(tabla, data) {
    const { id, ...datosActualizados } = data;
    const [result] = await pool.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [datosActualizados, id]);
    return result;
}

// Insertar o actualizar registro (usuarios)
async function agregar(tabla, data) {
    const id = parseInt(data.id);

    if (id === 0) {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE email = ?`, [data.email]);
            if (rows.length > 0) {
                return { status: false, mensaje: 'El correo ya está registrado' };
            }
            const result = await insertar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al insertar usuario:', error);
            return { status: false, mensaje: 'Error al insertar el registro' };
        }
    } else {
        try {
            const result = await actualizar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return { status: false, mensaje: 'Error al actualizar el registro' };
        }
    }
}

// Eliminar registro
async function eliminar(tabla, id) {
    const [result] = await pool.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
    return result;
}

// Login
async function login(tabla, data) {
    const { user, password } = data;

    try {
        const [rows] = await pool.query(`SELECT * FROM ?? WHERE email = ?`, [tabla, user]);
        if (rows.length === 0) return { status: false, mensaje: 'Usuario no encontrado' };

        const usuarioBD = rows[0];
        const coincide = await bcrypt.compare(password, usuarioBD.pw);

        return coincide
            ? { status: true, user: usuarioBD }
            : { status: false, mensaje: 'Contraseña incorrecta' };

    } catch (error) {
        console.error('Error en login:', error);
        return { status: false, mensaje: 'Error del servidor' };
    }
}

// Agregar dispositivo
async function agregar_dispositivo(tabla, data) {
    const id = parseInt(data.id);

    if (id === 0) {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE nombre_dispositivo = ?`, [data.nombre_dispositivo]);
            if (rows.length > 0) {
                return { status: false, mensaje: 'El dispositivo ya está registrado' };
            }
            const result = await insertar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al insertar dispositivo:', error);
            return { status: false, mensaje: 'Error al insertar el dispositivo' };
        }
    } else {
        try {
            const result = await actualizar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al actualizar dispositivo:', error);
            return { status: false, mensaje: 'Error al actualizar el dispositivo' };
        }
    }
}

// Actualizar status de dispositivo
async function actualizar_status_dispositivo(tabla, data) {
    const { id, status } = data;
    const statusNum = status === true || status === 1 ? 1 : 0;

    try {
        const [result] = await pool.query(`UPDATE ?? SET status = ? WHERE id = ?`, [tabla, statusNum, id]);
        return result.affectedRows > 0
            ? { status: true, mensaje: 'Status actualizado correctamente', resultado: result }
            : { status: false, mensaje: 'No se encontró el dispositivo para actualizar' };
    } catch (error) {
        console.error('Error al actualizar status del dispositivo:', error);
        return { status: false, mensaje: 'Error en la base de datos al actualizar el status' };
    }
}

// Agregar puerta
async function agregar_puerta(tabla, data) {
    const id = parseInt(data.id);

    if (id === 0) {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE nombre_puerta = ?`, [data.nombre_puerta]);
            if (rows.length > 0) {
                return { status: false, mensaje: 'La puerta ya está registrada' };
            }
            const result = await insertar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al insertar puerta:', error);
            return { status: false, mensaje: 'Error al insertar la puerta' };
        }
    } else {
        try {
            const result = await actualizar(tabla, data);
            return { status: true, resultado: result };
        } catch (error) {
            console.error('Error al actualizar puerta:', error);
            return { status: false, mensaje: 'Error al actualizar la puerta' };
        }
    }
}

// Actualizar status de puerta
async function actualizar_status_puerta(tabla, data) {
    const { nombre_puerta, status } = data;

    try {
        const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE nombre_puerta = ?`, [nombre_puerta]);
        if (rows.length === 0) {
            return { status: false, mensaje: 'La información de la puerta no ha sido encontrada' };
        }

        const [result] = await pool.query(`UPDATE ${tabla} SET status = ? WHERE nombre_puerta = ?`, [status, nombre_puerta]);
        return result.affectedRows > 0
            ? { status: true, mensaje: 'Status actualizado correctamente', resultado: result }
            : { status: false, mensaje: 'No se pudo actualizar el status' };
    } catch (error) {
        console.error('Error al actualizar status:', error);
        return { status: false, mensaje: 'Error al actualizar el status de la puerta' };
    }
}

// Exportar funciones
module.exports = {
    uno,
    todos,
    agregar,
    eliminar,
    actualizar,
    login,
    agregar_dispositivo,
    actualizar_status_dispositivo,
    agregar_puerta,
    actualizar_status_puerta
};
