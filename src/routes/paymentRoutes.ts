import { Router } from 'express';
import { initiateStkPush, mpesaCallback, verifyPayment } from '../controllers/paymentController';
import { validateRequest } from '../middleware/validateRequest';
import { stkPushSchema, verifyPaymentSchema } from '../validators/paymentValidator';

const router = Router();

router.post('/stkpush', validateRequest(stkPushSchema), initiateStkPush);
router.post('/callback', mpesaCallback);
router.post('/verify', validateRequest(verifyPaymentSchema), verifyPayment);

export default router;
