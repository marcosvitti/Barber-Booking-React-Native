import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class Hour extends Model {
    static init(connection) {
        super.init({
            hour: DataTypes.TIME,
            status: DataTypes.BOOLEAN
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.belongsTo(models.Available, { foreignKey: 'available', as: 'availables' });
        this.hasMany(models.Appointment, { foreignKey: 'hour', as: 'appointments' });
    }
}