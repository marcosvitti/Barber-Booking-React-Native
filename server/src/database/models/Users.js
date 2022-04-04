import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class User extends Model {
    static init(connection) {
        super.init({
            username: DataTypes.STRING(16),
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            avatar: {
                type: DataTypes.TEXT,
                defaultValue: "media/avatars/default.png"
            },
            status: DataTypes.BOOLEAN,
            token: DataTypes.STRING,
        }, {
            sequelize: connection,
            tableName: 'users'
        });
    }

    static associate(models) {
        this.belongsToMany(models.Barber, { foreignKey: 'user', through: 'user_barbers_favorites', as: 'barbers' } );
        this.hasMany(models.Testimonial, { foreignKey: 'user', as: 'BarberTestimonials' });
        this.hasMany(models.Appointment, { foreignKey: 'user', as: 'appointments' });
    }
}