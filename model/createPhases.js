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
        insert into phases (id, word, hint1, hint2, hint3)
            VALUES (1, 
                    'ENGENHARIA SOCIAL',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A arte de exploram a confiança para convencer alguém a compartilhar dados ou dar acesso a sistemas.',
                    'Phishing, Baiting, Pretexting, Spear Phishing estao entre suas principais tecnicas'
                    ),
                    (2, 
                    'PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ),
                    (3, 
                    'PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ),
                    (4, 
                    'PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    ),
                    (5, 
                    'PHISHING',
                    'Tem como base induzir vítimas a revelar informações ou realizar ações sem perceber o risco.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.',
                    'A base da engenharia social: induzir vítimas a revelar informações ou realizar ações sem per.'
                    );`
)}