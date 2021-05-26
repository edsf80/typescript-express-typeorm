import { Post } from "../models";
import BaseController from "./base.controller";
import { getConnection } from 'typeorm';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { body } from 'express-validator';

export class PostController extends BaseController<Post> {

    constructor(public path: string) {
        super(path, getConnection().getCustomRepository(PostRepository), []);
    }
}

export class UserController extends BaseController<User> {

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
}