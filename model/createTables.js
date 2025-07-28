import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    current_phase INTEGER DEFAULT 1,
    energy INTEGER DEFAULT 5,
    last_energy_update TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS phases (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    hint1 VARCHAR(255),
    hint2 VARCHAR(255),
    hint3 VARCHAR(255)
);

-- Função para regenerar energia
CREATE OR REPLACE FUNCTION regenerate_energy()
RETURNS void AS $$
BEGIN
    UPDATE users
    SET energy = LEAST(energy + 1, 5),
        last_energy_update = NOW()
    WHERE energy < 5;
END;
$$ LANGUAGE plpgsql;
`;

const createCronSQL = `
CREATE EXTENSION IF NOT EXISTS pg_cron;
-- Agendamento usando pg_cron: a cada 15 minutos
SELECT cron.schedule('regenerate_energy', '*/15 * * * *', $$SELECT regenerate_energy();$$);
`;

async function setup() {
    try {
        await db.query(createTablesSQL);
        console.log("Tabelas e função criadas com sucesso!");

        // Tenta agendar o evento (pg_cron precisa estar instalado)
        try {
            await db.query(createCronSQL);
            console.log("Evento de regeneração de energia agendado!");
        } catch (err) {
            console.warn("Não foi possível agendar o evento com pg_cron. Verifique se a extensão está instalada.");
        }
    } catch (err) {
        console.error("Erro ao criar tabelas ou função:", err);
    } finally {
        db.end();
    }
}

setup();