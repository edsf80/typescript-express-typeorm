import { ObjectType, Repository } from 'typeorm';
import { Router, Request, Response, NextFunction } from 'express';
import { getConnection } from 'typeorm';
import HttpException from '../exceptions/http.exception';

export default class BaseController<T> {

    private repository: Repository<T>;

    public router = Router();

    constructor(public path: string, type: ObjectType<Repository<T>>) {
        this.repository = getConnection().getCustomRepository(type);        
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

    public initializeRoutes() {
        this.router.get(this.path, this.findAll);
        this.router.get(`${this.path}/:id`, this.findById);
        this.router.post(this.path, this.save);
        this.router.put(`${this.path}/:id`, this.update);
        this.router.delete(`${this.path}/:id`, this.delete);
    }
}