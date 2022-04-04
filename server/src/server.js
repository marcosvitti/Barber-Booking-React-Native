import express from 'express';
import { routes } from './config/routes.js';
import './database/index.js';

const server = express();

server.use(express.json());
server.use((req, res, next) => {
    /*if (!(req.headers.token === '950cd97f8968088fca1a2bcc2854dee6')) {
        return res.status(400).json({erro: 1, message: "Token inválido ou inexistente!"});
    }*/

    next();
});
server.use(routes);

const listener = server.listen(81, async () => {
    console.log('SERVER INICIALIZADO...');
  });
  
process.on('SIGINT', function () {
    listener.close();
});

process.on('exit', () => {
    listener.close();
});