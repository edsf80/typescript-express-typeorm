import { Post } from "../models";
import BaseController from "./base.controller";
import { getConnection } from 'typeorm';
import { PostRepository } from '../repositories/post.repository';

export class PostController extends BaseController<Post> {

    constructor(public path: string) {
        super(path, getConnection().getCustomRepository(PostRepository), []);
    }
}