import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

export default class Barber extends Model {
    static init(connection) {
        super.init({
            name: DataTypes.STRING,
            avatar: DataTypes.STRING,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            status: DataTypes.BOOLEAN
        }, {
            sequelize: connection,
            tableName: 'barbers'
        });
    }

    static associate(models) {
        this.hasMany(models.Available, { foreignKey: 'barber', as: 'availables' });
        this.hasMany(models.Photo, { foreignKey: 'barber', as: 'photos' });
        this.belongsToMany(models.User, { foreignKey: 'barber', through: 'user_barbers_favorites', as: 'users' });
        this.hasMany(models.Testimonial, { foreignKey: 'barber', as: 'userTestimonials' });
        this.hasMany(models.BarberService, { foreignKey: 'barber', as: 'barberServices' });
    }
}