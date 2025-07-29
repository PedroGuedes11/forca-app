import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export async function createPhases() {
    // Remove todas as fases existentes
    await db.query("DELETE FROM phases;");

    // Insere as fases novas
    await db.query(`
        INSERT INTO phases (word, hint1, hint2, hint3)
        VALUES
            ('ENGENHARIA SOCIAL',
                'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                'A arte de exploram a confiança para convencer alguém a compartilhar dados ou dar acesso a sistemas.',
                'Phishing, Baiting, Pretexting, Spear Phishing estão entre suas principais técnicas'
            ),
            ('PHISHING',
                'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem perceber.',
                'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem perceber.'
            )
            -- Adicione outras fases aqui
    `);

    console.log("Fases criadas com sucesso!");
}