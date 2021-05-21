import App from './app'
import { createConnection } from 'typeorm';
import dbConfig from "./config/database";
import { PostController } from './controllers/common.controller';
import UserController from './controllers/user.controller';
import AuthController from './controllers/auth.controller';

const PORT = process.env.PORT || 8000;

createConnection(dbConfig)
    .then((_connection) => {
        const app = new App(PORT, [
            new AuthController('/auth'),
            new UserController('/users'),
            new PostController('/posts')
        ]);
        app.listen();
    })
    .catch((err) => {
        console.log('Unable to connection to db', err);
        process.exit(1);
    });

