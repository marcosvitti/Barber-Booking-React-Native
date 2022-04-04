import Barber from '../../database/models/Barbers.js';
import User from '../../database/models/Users.js';
import GeoPoint from 'geopoint';
import Testimonial from '../../database/models/Testimonials.js';
import Service from '../../database/models/Services.js';
import BarberService from '../../database/models/BarberServices.js';
import Sequelize from 'sequelize';

function getDistance(barber_lat, barber_lng , lat, lng) {
    if (!barber_lat || !barber_lng) {
        return -1;
    }

    const pointBarber = new GeoPoint(parseFloat(barber_lat),  parseFloat(barber_lng), false);
    const pointUser = new GeoPoint(parseFloat(+lat? lat : -23.55052),  parseFloat(+lng === 'null' ? lng : -46.633309), false);

    return pointUser.distanceTo(pointBarber, true);
}

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
        const { name, avatar, latitude, longitude } = req.body;

        try {
            const barber = await Barber.create({
                name, avatar, latitude, longitude
            });

            return res.status(200).json(barber);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        try {
            const { token, lat, lng, address, name } = req.query;
            const barber_array = [];

            const user = await User.findOne({
                where: {
                    token,
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'Invalid token'
                });
            }

            await Barber.findAll({
                where: {
                    status: 1,
                    name: {
                        [Sequelize.Op.like]: `%${ (name !== undefined && name !== 'null') ? name : '' }%`
                    }
                }
            }).then(barbers => {
                const response = async () => {
                    await asyncForEach(barbers, async (barber) => {
                        barber_array.push({
                            id: barber.id,
                            name: barber.name,
                            avatar: barber.avatar,
                            stars: await getStars(barber.id),
                            latitude: barber.latitude ? barber.latitude : null,
                            longitude: barber.longitude ? barber.longitude : null,
                            distance: getDistance(barber.latitude, barber.longitude, lat, lng)
                        });
                    });
    
                    return res.status(200).json({
                        error: '',
                        data: barber_array,
                        loc: address ? address : 'São Paulo',
                        locLat: lat ? lat : -23.55052,
                        locLng: lng ? lng : -46.633309
                    });
                  }

                response();
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async update(req, res) {
        const { barber_id } = req.params;
        const { name, avatar, latitude, longitude } = req.body;

        const updated = await Barber.update(
            { name, avatar, latitude, longitude },
            {
                where: {
                    id: barber_id,
                    status: 1
                }
            }
        );

        return res.status(200).json({
            error: '',
            updated: updated[0] ? true : false,
        });
    },

    async status(req, res) {
        const { barber_id } = req.params;

        await Barber.findByPk(barber_id)
        .then((barber) => {
            if (!barber) {
                return res.status(400).json({
                    error: 'Barbeiro não encontrado!',
                });
            }

            barber.update({ status: !barber.status });

            return res.status(200).json({
                error: '',
                status: barber.status ? 'Ativo' : 'Inativo'
            });
        });
    },

    async indexById(req, res) {
        try {
            const { barber_id } = req.params;
            const { token } = req.query;

            const user = await User.findOne({
                where: {
                    token: token
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'Invalid token'
                });
            }

            await Barber.findOne({
                where: {
                    id: barber_id
                },
                include: [
                    {// Favoritos
                        association: 'users',
                        where: {
                            id: user.id
                        },
                        required: false
                    },
                    {// Fotos
                        association: 'photos',
                        where: {
                            status: 1,
                        },
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'barber' ]
                        }
                    },
                    {// Serviços do Barbeiro
                        association: 'barberServices',
                        required: false,
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'service', 'barber' ]
                        },
                        include: {// Serviços
                            association: 'services',
                            required: false,
                            attributes: {
                                exclude: [ 'id', 'createdAt', 'updatedAt' ]
                            },
                        }
                    },
                    {// Testimonials
                        association: 'userTestimonials',
                        required: false,
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'user', 'barber' ]
                        },
                        include: {// Usuários
                            association: 'userTestimonial',
                            attributes: {
                                exclude: [ 'id', 'email', 'password', 'avatar', 'token', 'createdAt', 'updatedAt' ]
                            },
                        }
                    },
                    {// Horários disponíveis
                        association: 'availables',
                        where: {
                            status: 1,
                        },
                        attributes: {
                            exclude: [ 'id', 'createdAt', 'updatedAt', 'barber' ]
                        },
                        separate: true,
                        order: [
                            ['date_available', 'ASC']
                        ],
                        include: {// Horas diponíveis
                            association: 'hours',
                            attributes: {
                                exclude: [ 'id', 'status', 'createdAt', 'updatedAt', 'available' ]
                            },
                            where: {
                                status: 1,
                            },
                            required: false,
                            separate: true,
                            order: [
                                ['hour', 'ASC']
                            ],
                        }
                    },
                ]
            }).then(async barber => {
                if (!barber) {
                    return res.status(404).json({
                        error: 'Barber not found'
                    });
                }

                const availables = [];
                const testimonials = [];
                const services = [];

                barber.availables.forEach((available) => {
                    const date = new Date(available.date_available);
                    const hours = [];

                    available.hours.forEach((hour) => {
                        const dateHour = new Date('0000-01-01T' + hour.hour);
                        hours.push(`${(dateHour.getHours() < 10 ? '0' : '')}${dateHour.getHours()}:${(dateHour.getMinutes() < 10 ? '0' : '')}${dateHour.getMinutes()}`);
                    });

                    if (hours.length > 0) {
                        availables.push({
                            date: `${date.getFullYear()}-${(date.getMonth() < 10 ? '0' : '')}${date.getMonth()+1}-${(date.getDate() < 10 ? '0' : '')}${date.getDate()}`,
                            hours
                        });
                    }
                });

                barber.userTestimonials.forEach((testimonial) => {
                    testimonials.push({
                        id: testimonial.id,
                        name: testimonial.userTestimonial.username,
                        rate: testimonial.rate,
                        body: testimonial.text
                    });
                });

                barber.barberServices.forEach((service) => {
                    services.push({
                        id: service.id,
                        name: service.services.descricao,
                        price: service.price,
                    });
                });

                return res.status(200).json({
                    error: '',
                    data: {
                        id: barber.id,
                        name: barber.name,
                        avatar: barber.avatar,
                        stars: await getStars(barber.id),
                        latitude: barber.latitude ? barber.latitude : null,
                        longitude: barber.longitude ? barber.longitude : null,
                        favorited: barber.users.length > 0 ? true : false,
                        photos: barber.photos,
                        services: services,
                        testimonials: testimonials,
                        available: availables
                    }
                });
            });
        } catch (err) {
            console.log(err)
            return res.status(400).json(err);
        }
    },

    async service(req, res) {
        const { barber_id } = req.params;
        const { service: service_id, price } = req.body;

        try {
            const barber = await Barber.findByPk(barber_id);

            if (!barber) {
                return res.status(400).json({
                    error: 'Barber not found!'
                });
            }
    
            const service = await Service.findByPk(service_id);

            if (!service) {
                return res.status(400).json({
                    error: 'Service not found!'
                });
            }

            const barber_service = await BarberService.create({
                barber: barber.id, service: service.id, price
            });

            return res.status(200).json({
                error: '',
                barber_service
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },

    async serviceDestroy(req, res) {
        const { barber_id } = req.params;
        const { token, service: service_id } = req.body;

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

            const service = await Service.findOne({
                where: {
                    id: service_id,
                    status: 1
                }
            });

            if (!service) {
                return res.status(400).json({
                    error: 'Serviço não encontrado!'
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

            const barberService = await BarberService.findOne({
                where: {
                    barber: barber_id,
                    service: service.id,
                }
            });

            barberService.destroy();

            return res.status(200).json({
                error: '',
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async services(req, res) {
        const { barber_id } = req.params;

        try {
            const barber = await Barber.findOne({
                where: {
                    id: barber_id,
                    status: 1
                },
                include: [
                    {
                        association: 'barberServices',
                        include: {
                            association: 'services',
                        },
                    },
                ]
            });

            if (!barber) {
                return res.status(400).json({
                    error: 'Barber not found!'
                });
            }

            return res.status(200).json(barber);
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },
}