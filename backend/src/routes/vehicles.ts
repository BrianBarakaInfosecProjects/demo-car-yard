import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { auth, adminOnly } from '../middleware/auth';
import { validate, validateBody } from '../middleware/validation';
import { vehicleSchema, vehicleFilterSchema } from '../utils/validators';
import { uploadSingle, uploadMultiple } from '../middleware/cloudinaryUpload';
import { auditLogger } from '../middleware/audit';

const router = Router();

router.get('/', vehicleController.getVehicles);
router.get('/featured', vehicleController.getFeaturedVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', auth, adminOnly, auditLogger('CREATE', 'VEHICLE'), uploadMultiple('images', 10), vehicleController.createVehicle);
router.put('/:id', auth, adminOnly, auditLogger('UPDATE', 'VEHICLE'), uploadMultiple('images', 10), vehicleController.updateVehicle);
router.delete('/:id', auth, adminOnly, auditLogger('DELETE', 'VEHICLE'), vehicleController.deleteVehicle);

export default router;
