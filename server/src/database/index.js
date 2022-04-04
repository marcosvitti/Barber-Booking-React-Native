import Sequelize from 'sequelize';
import dbConfig from '../config/database.js';

import User from '../database/models/Users.js';
import Barber from '../database/models/Barbers.js';
import Available from '../database/models/Availables.js';
import Hour from '../database/models/Hours.js';
import Photo from '../database/models/Photos.js';
import Testimonial from './models/Testimonials.js';
import Service from './models/Services.js';
import BarberService from './models/BarberServices.js';
import Appointment from './models/Appointments.js';

const connection = new Sequelize(dbConfig);

const test = async () => {
    try {
        await connection.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database');
    }
};

test();
User.init(connection);
Barber.init(connection);
Available.init(connection);
Hour.init(connection);
Photo.init(connection);
Testimonial.init(connection);
Service.init(connection);
BarberService.init(connection);
Appointment.init(connection);

User.associate(connection.models);
Barber.associate(connection.models);
Available.associate(connection.models);
Hour.associate(connection.models);
Photo.associate(connection.models);
Testimonial.associate(connection.models);
Service.associate(connection.models);
BarberService.associate(connection.models);
Appointment.associate(connection.models);

export default connection;