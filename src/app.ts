import express from 'express';
import cookieParser from 'cookie-parser';
import Controller from './controllers/interface.controller';
import morgan from 'morgan';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app: express.Application;

    constructor(private port: any, controllers: Controller[]) {
        this.app = express();
        
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App running on port ${this.port}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(express.static('dist'));
        this.app.use(morgan('tiny'));
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }   
}

export default App;