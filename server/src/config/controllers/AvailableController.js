import Available from '../../database/models/Availables.js';
import Barber from '../../database/models/Barbers.js';

export default {
    async store(req, res) {
        const { barber_id } = req.params;
        const { date_available } = req.body;

        try {
            const barber = await Barber.findOne({
                where: {
                    id: barber_id,
                    status: 1
                }
            });

            if (!barber) {
                return res.status(400).json({
                    error: 'Barber not found!'
                });
            }

            const available = await Available.create({
                barber: barber.id, date_available: date_available
            });

            return res.status(200).json(available);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        const { barber_id } = req.params;

        try {
            const barber = await Barber.findByPk(barber_id, {
                include: {
                    association: 'availables',
                    where: {
                        status: 1
                    }
                }
            });

            if (!barber) {
                return res.status(400).json({
                    error: 'Barber not found!'
                });
            }

            return res.status(200).json(barber);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async status(req, res) {
        const { available_id } = req.params;

        await Available.findByPk(available_id)
        .then((date) => {
            if (!date) {
                return res.status(400).json({
                    error: 'Data não encontrada!',
                });
            }

            date.update({ status: 0 });

            return res.status(200).json({
                error: '',
                status: date.status ? 'Ativo' : 'Inativo'
            });
        });
    },
}