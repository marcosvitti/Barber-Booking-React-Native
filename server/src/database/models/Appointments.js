import pgk from 'sequelize';
const { Model, DataTypes } = pgk;

export default class Appointment extends Model {
    static init(connection) {
        super.init({
            status: DataTypes.TINYINT,
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user', as: 'users' });
        this.belongsTo(models.BarberService, { foreignKey: 'barber_service', as: 'barber_services' });
        this.belongsTo(models.Hour, { foreignKey: 'hour', as: 'hours' });
    }
}