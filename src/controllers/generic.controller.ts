import { Repository } from 'typeorm';

export default class Controller<T> {

    constructor(private repository: Repository<T>) {        
    }

    public async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    public async save(body: T): Promise<T> {
        return this.repository.save(body);
    }
}