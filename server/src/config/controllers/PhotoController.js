import Photo from '../../database/models/Photos.js';
import Barber from '../../database/models/Barbers.js';

export default {
    async store(req, res) {
        const { barber_id } = req.params;
        const { url } = req.body;

        try {
            const barber = await Barber.findByPk(barber_id);

            if (!barber) {
                return res.status(400).json({
                    error: 'Barber not found!'
                });
            }

            const photo = await Photo.create({
                barber: barber_id, url
            });

            return res.status(200).json(photo);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        const { barber_id } = req.params;

        try {
            const barber = await Barber.findByPk(barber_id, {
                include: {
                    association: 'photos'
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
        const { photo_id } = req.params;

        await Photo.findByPk(photo_id)
        .then((photo) => {
            if (!photo) {
                return res.status(400).json({
                    error: 'Foto não encontrada!',
                });
            }

            photo.update({ status: !photo.status });

            return res.status(200).json({
                error: '',
                status: photo.status ? 'Ativo' : 'Inativo'
            });
        });
    },
}