import { Post, User } from "../models";
import BaseController from "./base.controller";
import { getConnection } from 'typeorm';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
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
                .withMessage('Please enter a valid email.')]);
    }    
}