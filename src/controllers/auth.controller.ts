import Controller from './interface.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';


class AuthController implements Controller {

    public router = Router();

    private userRepository: UserRepository;

    constructor(public path: string) {
        this.userRepository = getConnection().getCustomRepository(UserRepository);
        this.initializaRoutes();
    }

    private initializaRoutes() {
        this.router.post(`${this.path}/login`, [body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 })], this.validate, this.login);
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.userRepository.findOne({ email: req.body.email });
        if (user) {
            const passwordMatches = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatches) {
                user.password = '';
                res.send(user);
            } else {

            }
        } else {

        }
    }

    private validate = (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }            
    }
}

export default AuthController;