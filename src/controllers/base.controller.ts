import { ObjectType, Repository } from 'typeorm';
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import Controller from './interface.controller';
import validationMiddleware from '../middleware/validation.middleware';

export default class BaseController<T, K> implements Controller {

    private repository: Repository<T>;

    public router = Router();    

    constructor(public path: string, repo: Repository<T>, private type: ObjectType<K>) {
        this.repository = repo;
        this.initializeRoutes();
    }

    private findAll =  async (req: Request, res: Response) => {
        const data = await this.repository.find();
        res.send(data);
    }

    private save = async (req: Request, res: Response) => {
        const value = await this.repository.save(req.body);
        res.send(value);
    }

    private findById = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const value = await this.repository.findOne(id);
        if (value) {
            res.send(value)
        } else {
            next(new HttpException(404, `Resource id ${id} not found.`));
        }        
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const value = await this.repository.update(id, req.body);
        if (value) {
            res.send(value);
        } else {
            next(new HttpException(404, `Resource id ${id} not found.`));
        }
    }

    private delete = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const value = await this.repository.delete(id);
        if (value) {
            res.sendStatus(200);
        } else {
            next(new HttpException(404, `Resource id ${id} not found.`));
        }
    }

    private initializeRoutes() {
        this.router.get(this.path, this.findAll);
        this.router.get(`${this.path}/:id`, this.findById);
        this.router.post(this.path, validationMiddleware(this.type, true), this.save);
        this.router.patch(`${this.path}/:id`, validationMiddleware(this.type, true), this.update);
        this.router.delete(`${this.path}/:id`, this.delete);
    }
}