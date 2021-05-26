import { Repository } from 'typeorm';
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import Controller from './interface.controller';
import { ValidationChain, validationResult } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware';
import validate from '../middleware/validation.middleware';

export default class BaseController<T> implements Controller {

    public router = Router();

    constructor(public path: string, protected repository: Repository<T>, protected validators: ValidationChain[]) {
        this.initializeRoutes();
    }

    protected getRepository(): Repository<T> {
        return this.repository;
    }

    protected findAll = async (req: Request, res: Response) => {
        const data = await this.repository.find();
        res.send(data);
    }

    protected save = async (req: Request, res: Response, next: NextFunction) => {
        const value = await this.repository.save(req.body);
        res.send(value);
    }

    protected findById = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const value = await this.repository.findOne(id);
        if (value) {
            res.send(value)
        } else {
            next(new HttpException(`Resource id ${id} not found.`, 404));
        }
    }

    protected update = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const value = await this.repository.update(id, req.body);
        if (value) {
            res.send(value);
        } else {
            next(new HttpException(`Resource id ${id} not found.`, 404));
        }
    }

    protected delete = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const value = await this.repository.delete(id);
        if (value) {
            res.sendStatus(200);
        } else {
            next(new HttpException(`Resource id ${id} not found.`, 404));
        }
    }   

    protected initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.findAll);
        this.router.get(`${this.path}/:id`, authMiddleware, this.findById);
        this.router.post(this.path, authMiddleware, this.validators, validate, this.save);
        this.router.patch(`${this.path}/:id`, authMiddleware, this.validators, validate, this.update);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.delete);
    }
}