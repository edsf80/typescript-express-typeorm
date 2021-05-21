import { ObjectType, Repository } from 'typeorm';
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import Controller from './interface.controller';
import validationMiddleware from '../middleware/validation.middleware';
import { ValidationChain, validationResult } from 'express-validator';
import express from 'express';

export default class BaseController<T> implements Controller {

    private repository: Repository<T>;

    public router = Router();    

    constructor(public path: string, repo: Repository<T>, private validators: ValidationChain[]) {
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
        this.router.post(this.path, this.validators, (req: express.Request, res: express.Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }            
          }, this.save);
        this.router.patch(`${this.path}/:id`, this.validators, this.update);
        this.router.delete(`${this.path}/:id`, this.delete);
    }
}