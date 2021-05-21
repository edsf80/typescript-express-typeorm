import App from './app'
import { createConnection } from 'typeorm';
import dbConfig from "./config/database";
import { UserController, PostController } from './controllers/common.controller';

const PORT = process.env.PORT || 8000;

createConnection(dbConfig)
    .then((_connection) => {
        const app = new App(PORT, [
            new UserController('/users'),
            new PostController('/posts')
        ]);
        app.listen();
    })
    .catch((err) => {
        console.log('Unable to connection to db', err);
        process.exit(1);
    });

