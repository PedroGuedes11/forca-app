import { getAllUsersOrderByPhase , getPhasesLen , getWordById } from "../model/db.js";
import { handleDatabaseError } from "../public/js/utils.js";

/// Função para obter o ranking dos jogadores
export const getRanking = (req, res) => {
    getAllUsersOrderByPhase(20,(err, results) => {
        if (err) {
            return handleDatabaseError(err, res, "Error fetching ranking from MySQL");
        } 
        if (!results || results.length === 0) {
            return res.status(200).json([]);
        }
        // Adiciona a posição diretamente aos resultados ordenados
        const ranking = results.map((player, index) => ({
            position: index + 1,
            name: player.name,
            current_phase: player.current_phase,
        }));
        return res.status(200).json(ranking);
    });
};

// Função para obter o tamanho da lista de fases
export const getPhasesLength = (req,res) =>{
    getPhasesLen((err,results) => {
        if (err) {
            return handleDatabaseError(err, res, "Error fetching phases length from MySQL");
        } 
        if (!results || results.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(results);
    });
};

// Função para obter a palavra e dicas do id correspondente
export const getWord = (req, res) => {
    const { phaseId } = req.params; // Captura o parâmetro da rota
    if (!phaseId) {
        return res.status(400).json({ error: true, message: "phaseId não fornecido!" });
    }
    getWordById(phaseId,(err,results)=>{
        if(err){
            return handleDatabaseError(err, res, "Error fetching ranking from MySQL");
        }
        if(!results || results.length === 0){
            return res.status(200).json([]);
        }
        const wordObj = results[0];
        return res.status(200).json({
            error: false,
            message: "Fase recebida com sucesso!",
            wordObj: { word: wordObj.word, hint1: wordObj.hint1, hint2: wordObj.hint2 , hint3 : wordObj.hint3 },
        });
    });
};