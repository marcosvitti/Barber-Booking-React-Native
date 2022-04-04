import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class Photo extends Model {
    static init(connection) {
        super.init({
            url: DataTypes.STRING,
            status: DataTypes.BOOLEAN
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.belongsTo(models.Barber, { foreignKey: 'barber' });
    }
}