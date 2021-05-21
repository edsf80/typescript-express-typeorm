import { User } from "../models";
import BaseController from "./base.controller";
import { getConnection } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';
import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import HttpException from "../exceptions/http.exception";

export default class UserController extends BaseController<User> {

    constructor(public path: string) {
        super(path, getConnection().getCustomRepository(UserRepository), [
            body('email')
                .isEmail()
                .withMessage('Please enter a valid email.'),
            body('firstName')
                .trim()
                .not()
                .isEmpty(),
            body('lastName')
                .trim()
                .not()
                .isEmpty(),
            body('password')
                .trim()
                .isLength({ min: 5 })
        ]);
    } 
    
    protected initializeRoutes() {
        this.router.get(this.path, this.findAll);
        this.router.get(`${this.path}/:id`, this.findById);
        this.router.post(this.path, this.validators, this.validate, async (req: Request, res: Response, next: NextFunction) => {
            const user = await this.repository.findOne({email: req.body.email});
            if (user) {
                next(new HttpException(400, 'User already exists.'));
            } else {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = await this.repository.save({...req.body, password: hashedPassword});
                res.send(user);
            }
        });
        this.router.patch(`${this.path}/:id`, this.validators, this.validate, this.update);
        this.router.delete(`${this.path}/:id`, this.delete);
    }
}