import express from 'express';
import Controller from '../controllers/generic.controller';
import { User } from '../models';
import { UserRepository } from '../repositories/user.repository';
import { getConnection } from 'typeorm';

const router = express.Router();

router.get('/', async (req, res) => {
  const controller = new Controller<User>(getConnection().getCustomRepository(UserRepository));
  const response = await controller.findAll();
  return res.send(response);
});

router.get('/:id', async (req, res) => {
  const controller = new Controller<User>(getConnection().getCustomRepository(UserRepository));
  const response = await controller.findById(Number(req.params.id));
  return res.send(response);
});

router.post('/', async(req, res) => {
    const controller = new Controller<User>(getConnection().getCustomRepository(UserRepository));
    const response = await controller.save(req.body);
    return res.send(response);
});

export default router;