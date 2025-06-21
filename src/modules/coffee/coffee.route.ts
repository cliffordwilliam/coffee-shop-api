// src/modules/coffee/coffee.route.ts

import { Router } from 'express';
import * as coffeeController from './coffee.controller';

const router = Router();

router.get('/', coffeeController.getAll);
router.get('/:id', coffeeController.getById);
router.post('/', coffeeController.create);
router.put('/:id', coffeeController.update);
router.delete('/:id', coffeeController.remove);

export default router;
