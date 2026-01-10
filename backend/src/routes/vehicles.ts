import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { auth, adminOnly } from '../middleware/auth';
import { validate, validateBody } from '../middleware/validation';
import { vehicleSchema, vehicleFilterSchema } from '../utils/validators';

const router = Router();

router.get('/', vehicleController.getVehicles);
router.get('/featured', vehicleController.getFeaturedVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', auth, adminOnly, validateBody(vehicleSchema), vehicleController.createVehicle);
router.put('/:id', auth, adminOnly, validateBody(vehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', auth, adminOnly, vehicleController.deleteVehicle);

export default router;
