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
    await db.query("TRUNCATE TABLE phases RESTART IDENTITY;");

    // Insere as fases novas
    await db.query(`
        INSERT INTO phases (word, hint1, hint2, hint3)
        VALUES
            ('ENGENHARIA SOCIAL',
                'Técnica que explora vulnerabilidades humanas',
                'A arte de explorar a confiança para convencer alguém a compartilhar dados ou dar acesso a sistemas.',
                'Pode acontecer por telefone, e-mail ou pessoalmente'
            ),
            ('FATOR HUMANO',
                'Principal brecha na segurança digital',
                'Erros de usuários podem comprometer sistemas',
                'Treinamento ajuda a minimizar riscos'
            ),
            ('PERSUASAO',
                'Usada para influenciar decisões',
                'Seus 7 princípios são comumente aplicados em golpes digitais sofisticados',
                'Fundamental para entender como golpes manipulam emoções.'
            ),
            ('RECIPROCIDADE',
                'Tendência a retribuir favores',
                'Uma das técnicas de persuasão',
                'Um exemplo é dar brindes em troca de dados pessoais'
            ),
            ('COMPROMISSO',
                'Faz com que pessoas mantenham decisões anteriores',
                'Uma das técnicas de persuasão',
                'Pode levar à aceitação de termos inseguros'
            ),
            ('AUTORIDADE',
                'Diz que pessoas obedecem à figuras reconhecidas',
                'Uma das técnicas de persuasão',
                'Uniformes e/ou títulos falsos são comuns'
            ),
            ('PROVA SOCIAL',
                'Pessoas seguem comportamentos populares',
                'Uma das técnicas de persuasão',
                'Um exemplo é quando usam depoimentos falsos como isca'
            ),
            ('CONTRASTE',
                'Princípio da persuasão que compara extremos para persuadir',
                'Golpistas usam para tornar ofertas falsas mais atrativas',
                'Um exemplo seria usar de grandes descontos seguidos de urgência'
            ),
            ('ESCASSEZ',
                'Diz que algo limitado parece mais valioso',
                'Uma das técnicas de persuasão',
                'Cria sensação de urgência e decisão apressada'
            ),
            ('SIMPATIA',
                'Tendemos a confiar em quem gostamos',
                'Uma das técnicas de persuasão',
                'Golpistas simulam gentileza para enganar'
            ),
            ('MALWARE',
                'Software malicioso que causa danos',
                'Pode roubar, corromper ou bloquear arquivos',
                'Chega via downloads, links ou anexos'
            ),
            ('VIRUS',
                'Se espalha ao infectar outros arquivos',
                'Precisa da ação do usuário para se propagar',
                'Pode danificar sistemas e dados'
            ),
            ('WORMS',
                'Se replica automaticamente na rede',
                'Dispensa interação humana',
                'Consome recursos e espalha sem controle'
            ),
            ('TROJANS',
                'Disfarçado como software legítimo',
                'Abre portas para invasores',
                'Nome inspirado em cavalo lendário'
            ),
            ('SPYWARE',
                'Espiona atividades do usuário',
                'Rastreia informações como senhas e histórico',
                'Pode ser silencioso e difícil de detectar'
            ),
            ('RANSOMWARE',
                'Sequestra arquivos e cobra resgate',
                'Encripta dados e exige pagamento',
                'Alta ameaça em ambientes corporativos'
            ),
            ('CRIPTOMALWARE',
                'Variante do ransomware que encripta dados',
                'Usa algoritmos avançados de criptografia',
                'Inviabiliza o acesso aos arquivos sem chave'
            ),
            ('ADWARE',
                'Exibe anúncios não autorizados',
                'Pode coletar dados de navegação',
                'Muitas vezes vem com softwares gratuitos'
            ),
            ('ROOTKITS',
                'Esconde presença de ameaças no sistema',
                'Atua em níveis profundos do computador',
                'Dificulta detecção por antivírus'
            ),
            ('BOTNETS',
                'Rede de máquinas infectadas e controladas',
                'Usada para ataques em massa',
                'Pode executar ações sem o dono perceber'
                ),
                
            ('SPAMS',
                'Mensagens indesejadas em massa',
                'Podem conter links maliciosos',
                'Prejudicam produtividade e segurança'
            ),
            ('SEXTORSAO',
                'Chantagem envolvendo conteúdos íntimos',
                'Pode usar engenharia social para obter fotos',
                'Crime sério com impacto psicológico'
            ),
            ('HOAX LETTERS',
                'Mensagens falsas com teor alarmante',
                'Espalham desinformação entre usuários',
                'Incentivam compartilhamento em massa'
            ),
            ('CHAIN LETTERS',
                'Prometem sorte ou ameaças se não forem compartilhadas',
                'Visam gerar tráfego ou viralização',
                'Antigas, mas ainda circulam em redes'
            ),
            ('SCAREWARE',
                'Simula alerta falso de ameaça',
                'Incentiva compra de softwares inseguros',
                'Apresenta pop-ups e mensagens urgentes'
            ),
            ('PHISHING',
                'Imita comunicação confiável',
                'Rouba dados por meio de páginas falsas',
                'Pode parecer e-mail de banco ou loja'
            ),
            ('VISHING',
                'Phishing por voz (telefone)',
                'Golpistas fingem ser suporte técnico',
                'Tipo de Phishing'
            ),
            ('WHALING',
                'Tipo de Phishing que mira grandes alvos (executivos)',
                'Ataques personalizados e discretos',
                'Buscam dados corporativos de alto valor'
            ),
            ('SMISHING',
                'Phishing via SMS ou mensagens instantâneas',
                'Usa links curtos e textos alarmantes',
                'Comum em falsas promoções ou entregas'
            ),
            ('CLONE PHISHING',
                'Cópia de e-mail legítimo com link malicioso',
                'Tipo de Phishing difícil de identificar pela aparência',
                'Aproveita mensagens anteriores reais'
            ),
            ('BAITING',
                'Tipo de Phishing que usa iscas como brindes ou curiosidade',
                'Atrai usuários para clicar ou baixar',
                'Pode aparecer em pendrives deixados em locais públicos'
            ),
            ('HTTP PHISHING',
                'Tipo de Phishing que usa página fraudulenta sem criptografia segura',
                'URL começa com “http” ao invés de “https”',
                'Indício de site falso ou inseguro'
            ),
            ('PRETEXTING',
                'Criação de cenário falso para obter informação',
                'Golpista finge ser alguém confiável',
                'Tipo de Phishing que envolve roteiro bem elaborado'
            ),
            ('KEYLOGGERS',
                'Captura tudo que o usuário digita',
                'Rouba senhas e dados bancários',
                'Pode ser software ou hardware'
            ),
            ('DOIS FATORES',
                'Adiciona camada extra de segurança',
                'Combina senha com outro método, como código SMS',
                'Reduz risco mesmo se senha for roubada'
            ),
            ('GERENCIADOR DE SENHAS',
                'Armazena credenciais de forma segura',
                'Facilita o uso de senhas fortes e variadas',
                'Ajuda a evitar reutilização e esquecimento'
            ),
            ('EDUCACAO DIGITAL',
                'Conhecer os riscos online é o primeiro passo',
                'Treinamentos reduzem falhas humanas',
                'Compartilhar conhecimento ajuda toda a equipe'
            ),
            ('ATUALIZACOES DE SISTEMA',
                'Manter sistemas e apps sempre atualizados',
                'Corrige falhas que poderiam ser exploradas',
                'Evita brechas conhecidas por cibercriminosos'
            ),
            ('SENHAS FORTES',
                'Longas, com letras, números e símbolos',
                'Nelas evitam-se datas de aniversário e nomes pessoais',
                'Nunca repeti-las em vários serviços'
            ),
            ('VERIFICAR LINKS',
                'Consiste em, antes de clicar, passar o mouse e analisar',
                'Pressupõe que links suspeitos podem ter erros sutis ou redirecionamentos falsos',
                'Segundo essa técnica é preferível acessar sites digitando a URL manualmente'
            )
    `);

    console.log("Fases criadas com sucesso!");
}