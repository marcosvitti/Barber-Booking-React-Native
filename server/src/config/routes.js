import express from 'express';
import UserController from './controllers/UserController.js';
import BarberController from './controllers/BarberController.js';
import AvailableController from './controllers/AvailableController.js';
import HourController from './controllers/HourController.js';
import PhotoController from './controllers/PhotoController.js'
import ServiceController from './controllers/ServiceController.js';
import TestimonialController from './controllers/TestimonialController.js';
import FavoriteController from './controllers/FavoriteController.js';
import AppointmentController from './controllers/AppointmentController.js';

const routes = express.Router();

// Login, logout e checar Login
routes.post('/auth/refresh', UserController.refresh); // Checar login - OK
routes.post('/auth/login', UserController.login); // Fazer login - OK
routes.post('/auth/logout', UserController.logout); // Fazer logout - OK

// CRUD usuário
routes.get('/users', UserController.index); // Listagem dos usuários - OK
routes.post('/user', UserController.store); // Criar um usuário - OK
routes.post('/user/:user_id', UserController.update); // Altera o usuário - OK
routes.post('/user/status/:user_id', UserController.status); // Exclui o usuário - OK
//// Adicionar barbeiro na lista de favoritos do usuário
routes.get('/user/favorites', FavoriteController.index); // Listagem dos barbeiros favoritos do usuário - OK
routes.post('/user/add/favorite', FavoriteController.store); // Adiciona o barbeiro na lista de favoritos - OK
routes.post('/user/del/favorite', FavoriteController.destroy); // Remove o barbeiro na lista de favoritos - OK

// CRUD barbeiro
routes.get('/barbers', BarberController.index); // Listagem de todos barbeiros - OK
routes.get('/barber/:barber_id', BarberController.indexById); // Listagem de barbeiro por ID - OK
routes.post('/barbers', BarberController.store); // Criar um barbeiro - OK
routes.post('/barber/:barber_id', BarberController.update); // Altera o barbeiro - OK
routes.post('/barber/status/:barber_id', BarberController.status); // Exclui o barbeiro - OK
//// Adicionar fotos
routes.get('/barber/:barber_id/photos', PhotoController.index); // Listagem das fotos do barbeiro - OK
routes.post('/barber/:barber_id/photo', PhotoController.store); // Cria uma foto para o barbeiro - OK
routes.post('/photo/status/:photo_id', PhotoController.status); // Exclui uma foto - OK
//// Vincular serviço a um barbeiro
routes.get('/barber/:barber_id/services', BarberController.services); // Listagem dos serviços do barbeiro pelo ID - OK
routes.post('/barber/:barber_id/service', BarberController.service); // Vincula o serviço ao barbeiro - OK
routes.post('/barber/:barber_id/del/service', BarberController.serviceDestroy); // Desvincula o serviço ao barbeiro - OK

// CRUD serviços
routes.get('/services', ServiceController.index); // Listagem de todos serviços - OK
routes.post('/service', ServiceController.store); // Criar um serviço - OK
routes.post('/service/:service_id', ServiceController.update); // Altera o serviço - OK
routes.post('/service/status/:service_id', ServiceController.status); // Exclui o serviço - OK

// CRUD avaliação
routes.get('/barber/:barber_id/testimonials', TestimonialController.index); // Listagem das avaliações de um barbeiro - OK
routes.post('/barber/:barber_id/testimonial', TestimonialController.store); // Criar avaliação para um barbeiro - OK

// CRUD datas os barbeiros
routes.get('/barbers/:barber_id/availables', AvailableController.index); // Listagem das datas disponíveis do barbeiro - OK
routes.post('/barbers/:barber_id/available', AvailableController.store); // Criar uma data - OK
routes.post('/barbers/status/:available_id', AvailableController.status); // Exclui uma data - OK

// CRUD horários
routes.get('/available/:available_id/hours', HourController.index); // Listagem das horas disponíveis por data - OK
routes.post('/available/:available_id/hour', HourController.store); // Criar horário em um data - OK
routes.post('/hour/status/:hour_id', HourController.status); // Exclui um horário - OK

// CRUD agendamentos
routes.get('/appointments/:user_id', AppointmentController.index); // Listagem dos agendamentos do usuário - OK
routes.post('/appointments', AppointmentController.store); // Criar agendamento para um usuário - OK

export { routes };