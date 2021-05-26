import Controller from './interface.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models';
import HttpException from '../exceptions/http.exception';
import validate from '../middleware/validation.middleware';

interface TokenData {
    token: string;
    expiresIn: number;
}

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
            .isLength({ min: 5 })], validate, this.login);
        this.router.post(`${this.path}/register`, [
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
        ], validate, this.register);
        this.router.post(`${this.path}/logout`, this.logout);
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.userRepository.findOne({ email: req.body.email });
        if (user) {
            const passwordMatches = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatches) {
                user.password = '';
                const tokenData = this.createToken(user);
                res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                res.send(user);
            } else {

            }
        } else {

        }
    }

    private logout = (req: Request, res: Response) => {
        res.setHeader('Set-Cookie',['Authorization=;Max-age=0']);
        res.send(200);
    }

    private register = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.userRepository.findOne({ email: req.body.email });
        if (user) {
            next(new HttpException('User already exists.', 400));
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = await this.userRepository.save({ ...req.body, password: hashedPassword });
            res.send(user);
        }
    }    

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret: string = process.env.JWT_SECRET || '';
        return {
            expiresIn,
            token: jwt.sign({ id: user.id }, secret, { expiresIn }),
        };
    }

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}

export default AuthController;