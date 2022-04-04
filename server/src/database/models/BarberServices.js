import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class BarberService extends Model {
    static init(connection) {
        super.init({
            price: DataTypes.FLOAT,
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.belongsTo(models.Barber, { foreignKey: 'barber', as: 'barbers'  });
        this.hasMany(models.Service, { foreignKey: 'id' });
        this.belongsTo(models.Service, { foreignKey: 'service', as: 'services' });
        this.hasMany(models.Barber, { foreignKey: 'id' });
        this.hasMany(models.Appointment, { foreignKey: 'barber_service', as: 'appointments' });
    }
}