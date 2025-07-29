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

// Verifica se houve erro na conexão
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao PostgreSQL:", err);
        return;
    }
    console.log("Conectado ao PostgreSQL!");
});

// Cria um novo usuário
export const createUser = async (name, email, password) => {
    const result = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
    );
    return result.rows[0];
};

// Encontra um usuário pelo email
export const findUserByEmail = async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows;
};

// Encontra um usuário pelo id
export const findUserById = async (id) => {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

// Encontra um usuário pelo nome
export const findUserByName = async (name) => {
    const result = await db.query("SELECT * FROM users WHERE name = $1", [name]);
    return result.rows;
};

// Atualiza as informações do usuário
export const updateUser = async (id, name, email) => {
    const result = await db.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
        [name, email, id]
    );
    return result.rows[0];
};

// Atualiza a senha do usuário
export const updatePassword = async (email, password) => {
    const result = await db.query(
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
        [password, email]
    );
    return result.rows[0];
};

// Deleta um usuário
export const deleteUser = async (id) => {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    return true;
};

// Atualiza a fase atual do usuário
export const updatePhase = async (id, phase) => {
    const result = await db.query(
        "UPDATE users SET current_phase = $1 WHERE id = $2 RETURNING *",
        [phase, id]
    );
    return result.rows[0];
};

// Recebe a lista de usuários com limite para o ranking
export const getAllUsersOrderByPhase = async (limit) => {
    const result = await db.query(
        "SELECT * FROM users ORDER BY current_phase DESC LIMIT $1",
        [limit]
    );
    return result.rows;
};

// Recebe o tamanho da lista de fases
export const getPhasesLen = async () => {
    const result = await db.query("SELECT COUNT(*) FROM phases;");
    return result.rows[0].count;
};

// Recebe a palavra da fase e dicas correspondentes ao id
export const getWordById = async (id) => {
    const result = await db.query("SELECT * FROM phases WHERE id = $1", [id]);
    return result.rows;
};

// Decrementa a energia do usuário
export const decrementUserEnergy = async (id) => {
    const result = await db.query(
        "UPDATE users SET energy = energy - 1 WHERE id = $1 AND energy > 0 RETURNING *",
        [id]
    );
    return result.rows[0];
};

// Incrementa a energia do usuário
export const incrementUserEnergy = async (id) => {
    const result = await db.query(
        "UPDATE users SET energy = energy + 1 WHERE id = $1 RETURNING *",
        [id]
    );
    return result.rows[0];
};

export default db;