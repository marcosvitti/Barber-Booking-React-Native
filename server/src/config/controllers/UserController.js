import User from '../../database/models/Users.js';
import { v4 as uuidv4 } from 'uuid';

export default {
    async store(req, res) {
        const { name, email, password, avatar } = req.body;

        try {
            await User.findOrCreate(
                {
                    where: {
                        email
                    },
                    defaults: {
                        username: name, email, password, avatar, token: uuidv4()
                    }
                }
            ).then(([user, created]) => {
                if (!created) {
                    return res.status(400).json({
                        error: 'Esse e-mail já está sendo utilizado!',
                    });
                }

                return res.status(200).json({
                    error: '',
                    data: {
                        id: user.id,
                        name: user.username,
                        avatar: user.avatar,
                        email: user.email
                    },
                    token: user.token,
                });
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        try {
            const users = await User.findAll({
                where: {
                    status: 1
                }
            });

            return res.status(200).json(users);
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async update(req, res) {;
        const { user_id } = req.params;
        const { name, email, avatar } = req.body;

        const users = await User.findAll({
            where: {
                email,
                status: 1,
            }
        });

        if (users.length > 0 && (users.filter((user) => user.id == user_id)).length === 0) {
            return res.status(400).json({
                error: 'Esse e-mail já está sendo utilizado!',
            });
        }

        const updated = await User.update(
            { username: name, email, avatar },
            {
                where: {
                    id: user_id,
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
        const { user_id } = req.params;

        await User.findByPk(user_id)
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    error: 'Usuário não encontrado!',
                });
            }

            user.update({ status: !user.status });

            return res.status(200).json({
                error: '',
                status: user.status ? 'Ativo' : 'Inativo'
            });
        });
    },

    async refresh(req, res) {
        const { token } = req.body;

        try {
            await User.findOne({
                where: {
                    token: token
                }
            }).then(user => {
                if (!user) {
                    return res.status(400).json({
                        error: 'Invalid token'
                    });
                }

                user.update({
                    token: uuidv4()
                });

                return res.status(200).json({
                    error: '',
                    data: {
                        id: user.id,
                        name: user.username,
                        avatar: user.avatar,
                        email: user.email
                    },
                    token: user.token
                });
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        try {
            await User.findOne({
                where: {
                    email: email,
                    password: password
                }
            }).then(user => {
                if (!user) {
                    return res.status(400).json({
                        error: 'Wrong user and/or password'
                    });
                }

                user.update({
                    token: uuidv4()
                });

                return res.status(200).json({
                    error: '',
                    data: {
                        id: user.id,
                        name: user.username,
                        avatar: user.avatar,
                        email: user.email
                    },
                    token: user.token
                });
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    },

    async logout(req, res) {
        const { token } = req.body;

        try {
            await User.findOne({
                where: {
                    token
                }
            }).then(user => {
                if (!user) {
                    return res.status(400).json({
                        error: 'Invalid token'
                    });
                }

                user.update({
                    token: null
                });

                return res.status(200).json({
                    error: ''
                });
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    }
}