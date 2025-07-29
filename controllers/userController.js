import { updatePhase, updateUser , findUserById , decrementUserEnergy , incrementUserEnergy } from "../model/db.js";
import { handleDatabaseError } from "../public/js/utils.js";

// Função para atualizar a fase do usuário
export const updateCurrentPhase = (req, res) => {
    const { newPhase } = req.body;

    if (!newPhase || isNaN(newPhase)) {
        return res.status(400).json({ error: true, message : "Fase inválida." });
    }

    updatePhase(req.user.id, newPhase, (err) => {
        if (err) {
            return handleDatabaseError(err, res, "Erro ao atualizar fase no PostgresSQL");
        }
        return res.status(200).json({ error : false , message: "Fase atualizada com sucesso!" });
    });
};

// Função para atualizar as informações do usuário
export const updateUserInfo = (req, res) => {
    
    const { name , email } = req.body;
    const userId = req.user.id;

    updateUser(userId, name, email, (err) => {
        if (err) {
            return handleDatabaseError(err, res, "Erro ao atualizar informações do usuário no PostgresSQL");
        }
        return res.status(200).json({ error: false, message: "Informações atualizadas com sucesso!" });
    });
};

// Função para obter as informações do usuário
export const getUserInfos = async (req, res) => {
    const userId = req.body.id;
    findUserById(userId, async (err, results) => {
        if (err) {
            return handleDatabaseError(err, res, "Erro ao buscar usuário no PostgresSQL");
        }
        if (results.length === 0) {
            return res.status(401).json({ error: true , message : "Email nao encontrado" });
        }
        const user = results[0]; // Assume que o primeiro resultado é o usuário
        return res.status(200).json({
            error: false,
            message: "Informaçoes recebidas",
            user: { id: user.id, name: user.name, email: user.email, current_phase: user.current_phase },
            token
        });
    });
};

// Função para obter a energia do usuário
export const getUserEnergy = (req, res) => {
    const userId = req.user.id;
    findUserById(userId, (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: true, message: "Usuário não encontrado." });
        }
        const user = results[0];
        const current_energy = user.energy;
        const max_energy = 5;

        // Calcula tempo para o próximo ponto (em segundos)
        let secondsToNext = 0;
        if (current_energy < max_energy) {
            const lastUpdate = new Date(user.last_energy_update);
            const now = new Date();
            const diff = Math.floor((now - lastUpdate) / 1000); // segundos desde o último update
            secondsToNext = Math.max(0, 15 * 60 - diff); // 15 minutos = 900 segundos
        }

        return res.status(200).json({
            current_energy,
            max_energy,
            secondsToNext
        });
    });
};

// Função para decrementar a energia do usuário
export const decrementEnergy = (req, res) => {
    const userId = req.user.id;
    findUserById(userId, (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: true, message: "Usuário não encontrado." });
        }
        const user = results[0];
        if (user.energy > 0) {
            decrementUserEnergy(userId, (err2) => {
                if (err2) {
                    return res.status(500).json({ error: true, message: "Erro ao decrementar energia." });
                }
                return res.status(200).json({ error: false, message: "Energia decrementada com sucesso!" });
            });
        } else {
            return res.status(400).json({ error: true, message: "Energia insuficiente." });
        }
    });
};


// Função para incrementar a energia do usuário
export const incrementEnergy = (req, res) => {
    const userId = req.user.id;
    findUserById(userId, (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ error: true, message: "Usuário não encontrado." });
        }
        const user = results[0];
        if (user.energy < 5) {
            incrementUserEnergy(userId, (err2) => {
                if (err2) {
                    return res.status(500).json({ error: true, message: "Erro ao incrementar energia." });
                }
                return res.status(200).json({ error: false, message: "Energia incrementada com sucesso!" });
            });
        } else {
            console.log("Energia já está no máximo.");
        }
    });
};