import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export function createPhases(){
    db.query(`
        insert if not exists into phases (word, hint1, hint2, hint3)
            VALUES ('ENGENHARIA SOCIAL',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A arte de exploram a confiança para convencer alguém a compartilhar dados ou dar acesso a sistemas.',
                    'Phishing, Baiting, Pretexting, Spear Phishing estao entre suas principais tecnicas'
                    ),
                    ('PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ),
                    ('PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ),
                    ('PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ),
                    ('PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ) ON CONFLICT (id) DO NOTHING;;`
)}