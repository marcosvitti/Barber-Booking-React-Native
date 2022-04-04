import Service from "../../database/models/Services.js";

export default {
    async store(req, res) {
        try {
            const { descricao } = req.body;

            const service = await Service.create({
                descricao
            });

            return res.status(200).json(service);
        } catch (err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        try {
            const services = await Service.findAll({
                where: {
                    status: 1
                }
            });

            return res.status(200).json(services);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async update(req, res) {
        const { service_id } = req.params;
        const { descricao } = req.body;

        const services = await Service.findAll({
            where: {
                descricao,
                status: 1,
            }
        });

        if (services.length > 0 && (services.filter((service) => service.id == service_id)).length === 0) {
            return res.status(400).json({
                error: 'Já existe um serviço com esse nome!',
            });
        }

        const updated = await Service.update(
            { descricao },
            {
                where: {
                    id: service_id,
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
        const { service_id } = req.params;

        await Service.findByPk(service_id)
        .then((service) => {
            if (!service) {
                return res.status(400).json({
                    error: 'Serviço não encontrado!',
                });
            }

            service.update({ status: !service.status });

            return res.status(200).json({
                error: '',
                status: service.status ? 'Ativo' : 'Inativo'
            });
        });
    },
}