import {ConnectionOptions} from 'typeorm';
import {User, Post, Comment} from '../models';

const config: ConnectionOptions ={
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'msqluser',
    database: process.env.DB_NAME || 'teste',
    entities: [User, Post, Comment],
    synchronize: true
}

export default config;