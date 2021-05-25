import Controller from './interface.controller';
import { Router, Request, Response, NextFunction, response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import { User } from '../models';

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
            .isLength({ min: 5 })], this.validate, this.login);
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

    private validate = (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }            
    }

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        return {
          expiresIn,
          token: jwt.sign({id: user.id}, '', { expiresIn }),
        };
    }

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}

export default AuthController;