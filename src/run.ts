import App from './app'
import { Post, User } from './models';
import BaseController from './controllers/base.controller';
import { UserRepository } from './repositories/user.repository';
import { createConnection } from 'typeorm';
import dbConfig from "./config/database";
import { PostRepository } from './repositories/post.repository';

const PORT = process.env.PORT || 8000;

createConnection(dbConfig)
    .then((_connection) => {
        const app = new App(PORT, [new BaseController<User>('/users', UserRepository), new BaseController<Post>('/posts', PostRepository)]);
        app.listen();
    })
    .catch((err) => {
        console.log('Unable to connection to db', err);
        process.exit(1);
    });

