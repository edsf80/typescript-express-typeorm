import express from 'express';
import Controller from '../controllers/generic.controller';
import { User } from '../models';
import { UserRepository } from '../repositories/user.repository';
import { getConnection } from 'typeorm';

const router = express.Router();

router.get('/', async (_req, res) => {
  const controller = new Controller<User>(getConnection().getCustomRepository(UserRepository));
  const response = await controller.findAll();
  return res.send(response);
});

router.post('/', async(_req, res) => {
    const controller = new Controller<User>(getConnection().getCustomRepository(UserRepository));
    const response = await controller.save(_req.body);
    return res.send(response);
});

export default router;