import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class Testimonial extends Model {
    static init(connection) {
        super.init({
            rate: DataTypes.FLOAT,
            text: DataTypes.STRING,
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.belongsTo(models.Barber, { foreignKey: 'barber' });
        this.hasMany(models.User, { foreignKey: 'id', as: 'users' });
        this.belongsTo(models.User, { foreignKey: 'user', as: 'userTestimonial' });
        this.hasMany(models.Barber, { foreignKey: 'id', as: 'barbers' });
    }
}