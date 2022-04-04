import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class Service extends Model {
    static init(connection) {
        super.init({
            descricao: DataTypes.STRING,
            status: DataTypes.BOOLEAN
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.hasMany(models.BarberService, { foreignKey: 'service', as: 'barbers' });
    }
}