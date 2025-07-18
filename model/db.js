import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

// Cria a conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Verifica se houve erro na conexão
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("Conectado ao MySQL!");
});

// Função para executar consultas SQL
export const query = (sql, params, callback) => {
    db.query(sql, params, callback);
};

// Cria um novo usuário
export const createUser = (name, email, password, callback) => {
    query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], callback);
};

// Encontra um usuário pelo email
export const findUserByEmail = (email, callback) => {
    query("SELECT * FROM users WHERE email = ?", [email], callback);
};

// Encontra um usuário pelo id
export const findUserById = (id, callback) => {
    query("SELECT * FROM users WHERE id = ?", [id], callback);
};

//Encontra um usuario pelo nome
export const findUserByName = (name, callback) => {
    query("SELECT * FROM users WHERE name = ?", [name], callback);
}

// Atualiza as informações do usuário
export const updateUser = (id, name, email, callback) => {
    query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id], callback);
};

// Atualiza a senha do usuário
export const updatePassword = (email, password, callback) => {
    query("UPDATE users SET password = ? WHERE email = ?", [password, email], callback);
};

// Deleta um usuário
export const deleteUser = (id, callback) => {
    query("DELETE FROM users WHERE id = ?", [id], callback);
}

// Atualiza a fase atual do usuário
export const updatePhase = (id, phase, callback) => {
    query("UPDATE users SET current_phase = ? WHERE id = ?", [phase, id], callback);
};

// Recebe a lista de usuários com limite para o ranking
export const getAllUsersOrderByPhase = (limit, callback) => {
    query("SELECT * FROM users ORDER BY current_phase DESC LIMIT ?", [limit], callback);
};

// Recebe o tamanho da lista de fases
export const getPhasesLen = (callback) => {
    query("SELECT MAX(id) AS count FROM phases;", callback);
}

// Recebe a palavra da fase e dicas correspondentes ao id
export const getWordById = (id, callback) => {
    query("SELECT * FROM phases WHERE id = ? ", [id] ,callback);
}

// Decrementa a energia do usuário
export const decrementUserEnergy = (id, callback) => {
    query("UPDATE users SET energy = energy - 1 WHERE id = ? AND energy > 0", [id], callback);
};

// Incrementa a energia do usuário
export const incrementUserEnergy = (id, callback) => {
    query("UPDATE users SET energy = energy + 1 WHERE id = ?", [id], callback);
};

// Exporta a conexão do banco de dados como padrão
export default db;