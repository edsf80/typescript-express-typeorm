import express, {Application} from 'express';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import Router from './routes';
import dbConfig from "./config/database";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

app.use(Router);

createConnection(dbConfig)
    .then((_connection) => {
        app.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    })
    .catch((err) => {
        console.log('Unable to connection to db', err);
        process.exit(1);
    });
