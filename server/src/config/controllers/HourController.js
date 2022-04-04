import Hour from '../../database/models/Hours.js';
import Available from '../../database/models/Availables.js';

export default {
    async store(req, res) {
        const { available_id } = req.params;
        const { hour } = req.body;

        try {
            const available = await Available.findOne({
                where: {
                    id: available_id,
                    status: 1
                }
            });

            if (!available) {
                return res.status(400).json({
                    error: 'Dia indisponível!'
                });
            }

            const hour_create = await Hour.create({
                available: available.id, hour
            });

            return res.status(200).json(hour_create);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        const { available_id } = req.params;

        try {
            const available = await Available.findOne({
                where: {
                    id: available_id,
                    status: 1
                },
                include: {
                    association: 'hours',
                    required: false,
                    where: {
                        status: 1
                    }
                }
            });

            if (!available) {
                return res.status(400).json({
                    error: 'Dia indisponível!'
                });
            }

            return res.status(200).json(available);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async status(req, res) {
        const { hour_id } = req.params;

        await Hour.findByPk(hour_id)
        .then((hour) => {
            if (!hour) {
                return res.status(400).json({
                    error: 'Horário não encontrado!',
                });
            }

            hour.update({ status: 0 });

            return res.status(200).json({
                error: '',
                status: hour.status ? 'Ativo' : 'Inativo'
            });
        });
    },
}