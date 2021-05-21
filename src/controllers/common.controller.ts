import { Post, User } from "../models";
import BaseController from "./base.controller";
import { getConnection } from 'typeorm';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import PostDto from "../dtos/post.dto";
import { UserDto } from "../dtos/user.dto";

export class PostController extends BaseController<Post, PostDto> {

    constructor(public path: string) {
        super(path, getConnection().getCustomRepository(PostRepository), PostDto);
    }
}

export class UserController extends BaseController<User, UserDto> {

    constructor(public path: string) {
        super(path, getConnection().getCustomRepository(UserRepository), UserDto);
    }
}