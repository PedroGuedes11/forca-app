import { updatePhase, updateUser, findUserById, decrementUserEnergy, incrementUserEnergy } from "../model/db.js";

// Função para atualizar a fase do usuário
export const updateCurrentPhase = async (req, res) => {
    const { newPhase } = req.body;
    if (!newPhase || isNaN(newPhase)) {
        return res.status(400).json({ error: true, message: "Fase inválida." });
    }
    try {
        await updatePhase(req.user.id, newPhase);
        return res.status(200).json({ error: false, message: "Fase atualizada com sucesso!" });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao atualizar fase no PostgreSQL." });
    }
};

// Função para atualizar as informações do usuário
export const updateUserInfo = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;
    try {
        await updateUser(userId, name, email);
        return res.status(200).json({ error: false, message: "Informações atualizadas com sucesso!" });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao atualizar informações do usuário no PostgreSQL." });
    }
};

// Função para obter as informações do usuário
export const getUserInfos = async (req, res) => {
    const userId = req.body.id;
    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(401).json({ error: true, message: "Email não encontrado" });
        }
        return res.status(200).json({
            error: false,
            message: "Informações recebidas",
            user: { id: user.id, name: user.name, email: user.email, current_phase: user.current_phase }
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao buscar usuário no PostgreSQL." });
    }
};

// Função para obter a energia do usuário
export const getUserEnergy = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(500).json({ error: true, message: "Usuário não encontrado." });
        }
        const current_energy = user.energy;
        const max_energy = 5;
        let secondsToNext = 0;
        if (current_energy < max_energy) {
            const lastUpdate = new Date(user.last_energy_update);
            const now = new Date();
            const diff = Math.floor((now - lastUpdate) / 1000);
            secondsToNext = Math.max(0, 15 * 60 - diff);
        }
        return res.status(200).json({
            current_energy,
            max_energy,
            secondsToNext
        });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao buscar energia do usuário." });
    }
};

// Função para decrementar a energia do usuário
export const decrementEnergy = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(500).json({ error: true, message: "Usuário não encontrado." });
        }
        if (user.energy > 0) {
            await decrementUserEnergy(userId);
            return res.status(200).json({ error: false, message: "Energia decrementada com sucesso!" });
        } else {
            return res.status(400).json({ error: true, message: "Energia insuficiente." });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao decrementar energia." });
    }
};

// Função para incrementar a energia do usuário
export const incrementEnergy = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(500).json({ error: true, message: "Usuário não encontrado." });
        }
        if (user.energy < 5) {
            await incrementUserEnergy(userId);
            return res.status(200).json({ error: false, message: "Energia incrementada com sucesso!" });
        } else {
            return res.status(200).json({ error: false, message: "Energia já está no máximo." });
        }
    } catch (err) {
        return res.status(500).json({ error: true, message: "Erro ao incrementar energia." });
    }
};