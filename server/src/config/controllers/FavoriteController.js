import User from '../../database/models/Users.js';
import Barber from '../../database/models/Barbers.js';
import Testimonial from '../../database/models/Testimonials.js';

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

async function getStars(barber_id) {
    try {
        const barber = await Barber.findByPk(barber_id);

        if (!barber) {
            return 0;
        }

        const { rows, count } = await Testimonial.findAndCountAll({
            where: {
                barber: barber.id
            }
        });

        if (rows.length <= 0 || count <= 0) {
            return 0;
        }

        let totalStars = 0;

        rows.forEach(star => {
            totalStars += star.rate;
        });

        return (totalStars / count).toPrecision(2);
    } catch (err) {
        return 0;
    }
}

export default {
    async store(req, res) {
        const { token, barber: barber_id } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    token,
                    status: 1
                }
            });

            if (!user) {
                return res.status(400).json({
                    error: 'Token inválido!'
                });
            }

            const barber = await Barber.findOne({
                where: {
                    id: barber_id,
                    status: 1
                }
            });

            if (!barber) {
                return res.status(400).json({
                    error: 'Barbeiro não encontrado!'
                });
            }

            await user.addBarbers(barber);

            return res.status(200).json({
                error: '',
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        const { token } = req.query;

        try {
            const user = await User.findOne({
                where: {
                    token,
                    status: 1
                },
                include: [
                    {// Barbeiros Favoritos
                        association: 'barbers',
                    },
                ]
            });

            if (!user) {
                return res.status(400).json({
                    error: 'Token inválido!'
                });
            }

            const barbers = [];

            const response = async () => {
                await asyncForEach(user.barbers, async (barber) => {
                    barbers.push({
                        id: barber.id,
                        name: barber.name,
                        avatar: barber.avatar,
                        stars: await getStars(barber.id),
                    });
                });

                return res.status(200).json({
                    error: '',
                    data: barbers
                });
              }

            response();
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },

    async destroy(req, res) {
        const { token, barber: barber_id } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    token,
                    status: 1
                }
            });

            if (!user) {
                return res.status(400).json({
                    error: 'Token inválido!'
                });
            }

            const barber = await Barber.findOne({
                where: {
                    id: barber_id,
                    status: 1
                }
            });

            if (!barber) {
                return res.status(400).json({
                    error: 'Barbeiro não encontrado!'
                });
            }

            await user.removeBarber(barber);

            return res.status(200).json({
                error: '',
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },
}