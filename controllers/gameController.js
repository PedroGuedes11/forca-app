import { getAllUsersOrderByPhase , getPhasesLen , getWordById } from "../model/db.js";

// Função para obter o ranking dos jogadores
export const getRanking = async (req, res) => {
    try {
        const results = await getAllUsersOrderByPhase(20);
        if (!results || results.length === 0) {
            return res.status(200).json([]);
        }
        const ranking = results.map((player, index) => ({
            position: index + 1,
            name: player.name,
            current_phase: player.current_phase,
        }));
        return res.status(200).json(ranking);
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao pegar ranking." });
    }
};

// Função para obter o tamanho da lista de fases
export const getPhasesLength = async (req, res) => {
    try {
        const count = await getPhasesLen();
        return res.status(200).json({ count });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao pegar número de fases." });
    }
};

// Função para obter a palavra e dicas do id correspondente
export const getWord = async (req, res) => {
    const { phaseId } = req.params;
    if (!phaseId) {
        return res.status(400).json({ error: true, message: "ID da fase não informado." });
    }
    try {
        const results = await getWordById(phaseId);
        if (!results || results.length === 0) {
            return res.status(404).json({ error: true, message: "Fase não encontrada." });
        }
        return res.status(200).json(results[0]);
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao buscar fase." });
    }
};