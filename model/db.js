import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Função para executar consultas SQL
export const query = (sql, params, callback) => {
    db.query(sql, params)
        .then(result => callback(null, result.rows))
        .catch(err => callback(err, null));
};

// Verifica se houve erro na conexão
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao PostgreSQL:", err);
        return;
    }
    console.log("Conectado ao PostgreSQL!");
});

// Cria um novo usuário
export const createUser = (name, email, password, callback) => {
    query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password], callback);
};

// Encontra um usuário pelo email
export const findUserByEmail = (email, callback) => {
    query("SELECT * FROM users WHERE email = $1", [email], callback);
};

// Encontra um usuário pelo id
export const findUserById = (id, callback) => {
    query("SELECT * FROM users WHERE id = $1", [id], callback);
};

//Encontra um usuario pelo nome
export const findUserByName = (name, callback) => {
    query("SELECT * FROM users WHERE name = $1", [name], callback);
}

// Atualiza as informações do usuário
export const updateUser = (id, name, email, callback) => {
    query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id], callback);
};

// Atualiza a senha do usuário
export const updatePassword = (email, password, callback) => {
    query("UPDATE users SET password = $1 WHERE email = $2", [password, email], callback);
};

// Deleta um usuário
export const deleteUser = (id, callback) => {
    query("DELETE FROM users WHERE id = $1", [id], callback);
}

// Atualiza a fase atual do usuário
export const updatePhase = (id, phase, callback) => {
    query("UPDATE users SET current_phase = $1 WHERE id = $2", [phase, id], callback);
};

// Recebe a lista de usuários com limite para o ranking
export const getAllUsersOrderByPhase = (limit, callback) => {
    query("SELECT * FROM users ORDER BY current_phase DESC LIMIT $1", [limit], callback);
};

// Recebe o tamanho da lista de fases
export const getPhasesLen = (callback) => {
    query("SELECT COUNT(*) FROM phases;", callback);
}

// Recebe a palavra da fase e dicas correspondentes ao id
export const getWordById = (id, callback) => {
    query("SELECT * FROM phases WHERE id = $1", [id], callback);
}

// Decrementa a energia do usuário
export const decrementUserEnergy = (id, callback) => {
    query("UPDATE users SET energy = energy - 1 WHERE id = $1 AND energy > 0", [id], callback);
};

// Incrementa a energia do usuário
export const incrementUserEnergy = (id, callback) => {
    query("UPDATE users SET energy = energy + 1 WHERE id = $1", [id], callback);
};

// Exporta a conexão do banco de dados como padrão
export default db;