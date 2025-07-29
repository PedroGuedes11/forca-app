import pkg from "pg";
import dotenv from "dotenv";
import cron from 'node-cron';

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
    last_energy_update TIMESTAMP DEFAULT NOW() NOT NULL,
);

CREATE TABLE IF NOT EXISTS phases (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    hint1 VARCHAR(255),
    hint2 VARCHAR(255),
    hint3 VARCHAR(255)
);
`

let isRunning = false;
async function createCronSQL(){
    
    //Agenda a cada minuto
    cron.schedule('* * * * *', async () => {
        
        // Evita que o job seja executado simultaneamente
        if (isRunning) return;
        isRunning = true;

        console.log('[Job] Verificando energia dos usuarios...');

        const updateQuery = `
            UPDATE users
            SET energy = LEAST(energy + 1, 5)
            WHERE
            energy < 5 AND
            last_energy_update IS NOT NULL AND
            now() - last_energy_update >= interval '15 minutes';
        `;

        try {
            const result = await db.query(updateQuery);
            console.log(`[Job] Atualizado com sucesso: ${result.rowCount} linha(s) modificadas.`);
        } catch (err) {
            console.error('[Job] Erro ao executar o job:', err);
        }
        isRunning = false;
    });
}


export async function setup() {
    try {
        await db.query(createTablesSQL);
        console.log("Tabelas e função criadas com sucesso!");

        try {
            await createCronSQL();
            console.log("Evento de regeneração de energia agendado!");
        } catch (err) {
            console.warn("Não foi possível agendar o evento com node-cron. Verifique se a biblioteca está instalada.");
        }
    } catch (err) {
        console.error("Erro ao criar tabelas ou função:", err);
    }
};