import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class Available extends Model {
    static init(connection) {
        super.init({
            date_available: DataTypes.DATE,
            status: DataTypes.BOOLEAN
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.belongsTo(models.Barber, { foreignKey: 'barber' });
        this.hasMany(models.Hour, { foreignKey: 'available', as: 'hours' });
    }
}