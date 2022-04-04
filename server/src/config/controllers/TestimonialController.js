import User from '../../database/models/Users.js';
import Barber from '../../database/models/Barbers.js';
import Testimonial from '../../database/models/Testimonials.js';

export default {
    async store(req, res) {
        const { barber_id } = req.params;
        const { token, rate, text } = req.body;

        try {
            const user = await User.findOne({
                where: {
                    token,
                    status: 1
                }
            });

            if (!user) {
                return res.status(400).json({
                    error: 'Token inválido'
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

            const testimonial = await Testimonial.create({
                user: user.id, barber: barber.id, rate, text
            });

            return res.status(200).json({
                error: '',
                testimonial
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        const { barber_id } = req.params;

        try {
            const barber = await Barber.findOne({
                where: {
                    id: barber_id,
                    status: 1
                },
                include: [
                    {
                        association: 'userTestimonials',
                        include: { // Usuários
                            association: 'userTestimonial',
                            attributes: {
                                exclude: [ 'id', 'email', 'password', 'avatar', 'token', 'createdAt', 'updatedAt', 'status' ]
                            },
                        }
                    }
                ]
            });

            if (!barber) {
                return res.status(400).json({
                    error: 'Barbeiro não encontrado!'
                });
            }

            const testimonials = [];

            barber.userTestimonials.forEach((testimonial) => {
                testimonials.push({
                    id: testimonial.id,
                    name: testimonial.userTestimonial.username,
                    rate: testimonial.rate,
                    body: testimonial.text
                });
            });

            return res.status(200).json({
                error: '',
                data: {
                    id: barber.id,
                    name: barber.name,
                    avatar: barber.avatar,
                    testimonials: testimonials,
                }
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    }
}