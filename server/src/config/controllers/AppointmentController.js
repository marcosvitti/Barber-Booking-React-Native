import Appointment from '../../database/models/Appointments.js';
import User from '../../database/models/Users.js';
import BarberService from '../../database/models/BarberServices.js';
import Hour from '../../database/models/Hours.js';
import Sequelize from 'sequelize';

export default {
    async store(req, res) {
        const { token: token, user: user_id, barber_service: barber_service_id, date: date, hour: hour_time } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'O parâmetro "Token" é obrigatório!'
            });
        }

        if (!user_id) {
            return res.status(400).json({
                error: 'O parâmetro "Usuário" é obrigatório!'
            });
        }

        if (!barber_service_id) {
            return res.status(400).json({
                error: 'O parâmetro "Serviço" é obrigatório!'
            });
        }

        if (!hour_time) {
            return res.status(400).json({
                error: 'O parâmetro "Horário" é obrigatório!'
            });
        }

        const userApp = await User.findOne({
            where: {
                token: token,
                status: 1
            }
        });

        if (!userApp) {
            return res.status(400).json({
                error: 'Usuário do APP sem permissão!'
            });
        }

        const user = await User.findOne({
            where: {
                id: user_id,
                status: 1
            }
        });

        if (!user) {
            return res.status(400).json({
                error: 'Usuário não encontrado!'
            });
        }

        const barber_service = await BarberService.findOne({
            where: {
                id: barber_service_id,
            }
        });

        if (!barber_service) {
            return res.status(400).json({
                error: 'Serviço não encontrado!'
            });
        }

        const hour = await Hour.findOne({
            where: {
                hour: {
                    [Sequelize.Op.like]: `%${hour_time}%`
                },
                status: 1,
            },
            include: [
                 {// Dia disponível
                    association: 'availables',
                    where: {
                        date_available: {
                            [Sequelize.Op.like]: `%${date}%`
                        },
                        status: 1,
                    },
                    required: true
                },
            ]
        });

        if (!hour) {
            return res.status(400).json({
                error: 'Horário não encontrado!'
            });
        }

        try {
            const appointment = await Appointment.create({
                user: user.id, barber_service: barber_service.id, hour: hour.id
            });

            await Hour.update(
                { status: 2 },
                {
                    where: {
                        id: hour.id,
                    }
                }
            );

            return res.status(200).json({
                error: '',
                data: {
                    appointment: appointment
                },
            });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    async index(req, res) {
        const { token } = req.query;
        const { user_id } = req.params;
        console.log(token, user_id);

        if (!token) {
            return res.status(400).json({
                error: 'O parâmetro "Token" é obrigatório!'
            });
        }

        if (!user_id) {
            return res.status(400).json({
                error: 'O parâmetro "Usuário" é obrigatório!'
            });
        }

        const userApp = await User.findOne({
            where: {
                token: token,
                status: 1
            }
        });

        if (!userApp) {
            return res.status(400).json({
                error: 'Usuário do APP sem permissão!'
            });
        }

        const user = await User.findOne({
            where: {
                id: user_id,
                status: 1
            }
        });

        if (!user) {
            return res.status(400).json({
                error: 'Usuário não encontrado!'
            });
        }

        try {
            const appointments = await Appointment.findAll({
                where: {
                    status: 1
                },
                include: [
                    {// Usuários
                        association: 'users',
                        where: {
                            id: user.id
                        },
                        required: true
                    },
                    {// Serviços do Barbeiro
                        association: 'barber_services',
                        required: true,
                        include: [
                            {// Serviço
                                association: 'services',
                            },
                            {// Barbeiro
                                association: 'barbers',
                            }
                        ]
                    },
                    {// Horas diponíveis
                        association: 'hours',
                        required: true,
                        include: {// Dia disponível
                            association: 'availables',
                        }
                    },
                ],
                order: [
                    ['hours', 'availables', 'date_available', 'DESC'],
                ],
            });

            const appointmentsArray = [];

            appointments.forEach((appointment) => {
                const date = new Date(appointment.hours.availables.date_available);
                const hour = appointment.hours.hour.split(':');
                date.setHours(hour[0]);
                date.setMinutes(hour[1]);
                const expired = date > (new Date()) ? false : true;
                let money = Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                appointmentsArray.push(
                    {
                        appointment: {
                            id: appointment.id,
                            time: {
                                date: `${date.getDate() < 10 ? '0'+date.getDate() : date.getDate()}/${date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1}/${date.getFullYear()}`,
                                hour: `${hour[0]}:${hour[1]}`,
                            },
                            expired: expired,
                        },
                        barber: {
                            name: appointment.barber_services.barbers.name,
                            avatar: appointment.barber_services.barbers.avatar,
                        },
                        service: {
                            description: appointment.barber_services.services.descricao,
                            price: money.format(appointment.barber_services.price),
                        },
                    }
                );
            });

            return res.status(200).json({
                error: '',
                data: appointmentsArray,
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err.message });
        }
    },
}