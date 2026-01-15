import { Router } from 'express';
import * as bulkOperationController from '../controllers/bulkOperationController';
import { auth, adminOnly } from '../middleware/auth';
import { auditLogger } from '../middleware/audit';

const router = Router();

router.delete('/vehicles', auth, adminOnly, auditLogger('BULK_DELETE', 'VEHICLE'), bulkOperationController.bulkDeleteVehicles);
router.patch('/vehicles/status', auth, adminOnly, auditLogger('BULK_UPDATE_STATUS', 'VEHICLE'), bulkOperationController.bulkUpdateVehicleStatus);
router.patch('/vehicles/location', auth, adminOnly, auditLogger('BULK_UPDATE_LOCATION', 'VEHICLE'), bulkOperationController.bulkUpdateVehicleLocation);
router.patch('/vehicles/featured', auth, adminOnly, auditLogger('BULK_UPDATE_FEATURED', 'VEHICLE'), bulkOperationController.bulkSetFeatured);
router.patch('/vehicles/publish', auth, adminOnly, auditLogger('BULK_PUBLISH', 'VEHICLE'), bulkOperationController.bulkPublishVehicles);
router.patch('/vehicles/unpublish', auth, adminOnly, auditLogger('BULK_UNPUBLISH', 'VEHICLE'), bulkOperationController.bulkUnpublishVehicles);

export default router;