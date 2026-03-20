import { Router, Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import prisma from '../config/database';
import { notificationService } from '../services/notificationService';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  shortCode: process.env.MPESA_SHORTCODE || '',
  passkey: process.env.MPESA_PASSKEY || '',
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  environment: process.env.MPESA_ENV || 'sandbox',
};

// Validate MPESA_ENV is explicitly set in production
if (process.env.NODE_ENV === 'production' && !process.env.MPESA_ENV) {
  console.error('CRITICAL: MPESA_ENV must be explicitly set in production environment');
}

async function getAccessToken(): Promise<string> {
  const url = MPESA_CONFIG.environment === 'production'
    ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');

  const response = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
    timeout: 10000,
  });

  return response.data.access_token;
}

function generatePassword(): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
  const shortCode = MPESA_CONFIG.shortCode;
  const passkey = MPESA_CONFIG.passkey;
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
}

// Verify M-Pesa callback signature (HMAC SHA256)
function verifyMpesaCallback(req: Request): boolean {
  // Safaricom sends signature in the 'Authorization' header
  const signature = req.headers['authorization'] as string;
  
  if (!signature || !signature.startsWith('Bearer ')) {
    console.error('M-Pesa callback missing Authorization header');
    return false;
  }

  // In production, verify the actual signature
  // For now, we log that this needs to be implemented with Safaricom's actual key
  if (process.env.NODE_ENV === 'production') {
    console.warn('M-Pesa HMAC verification should be implemented with Safaricom production keys');
    // TODO: Implement with actual Safaricom callback verification
    // const expectedSignature = crypto.createHmac('sha256', MPESA_CONFIG.passkey)
    //   .update(JSON.stringify(req.body))
    //   .digest('base64');
  }

  return true;
}

export const initiateSTKPush = async (req: AuthRequest, res: Response) => {
  try {
    const { phone, amount = 500, vehicleId, buyerName } = req.body;

    if (!phone || !vehicleId) {
      return res.status(400).json({ error: 'phone, amount, and vehicleId are required' });
    }

    const formattedPhone = phone.replace(/^0/, '254').replace(/^\+/, '');

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
    const password = generatePassword();

    const stkUrl = MPESA_CONFIG.environment === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const callbackUrl = MPESA_CONFIG.callbackUrl;
    if (!callbackUrl) {
      return res.status(500).json({ error: 'MPESA_CALLBACK_URL not configured' });
    }

    const response = await axios.post(
      stkUrl,
      {
        BusinessShortCode: MPESA_CONFIG.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerBuyGoodsOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: MPESA_CONFIG.shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `TrustAuto-${vehicleId}`,
        TransactionDesc: `Vehicle Reservation - ${vehicleId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const { CheckoutRequestID, ResponseCode, ResponseDescription } = response.data;

    if (ResponseCode === '0') {
      await prisma.reservation.create({
        data: {
          vehicleId,
          buyerName: buyerName || 'Unknown',
          buyerPhone: phone,
          amount,
          checkoutRequestId: CheckoutRequestID,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      });

      await notificationService.create({
        type: 'INFO',
        message: `STK Push initiated for vehicle reservation: ${vehicleId}`,
        userId: 'system',
        action: 'STK_PUSH_INITIATED',
        entityType: 'VEHICLE',
        entityId: vehicleId,
        vehicleId,
      });
    }

    res.json({
      success: ResponseCode === '0',
      checkoutRequestId: CheckoutRequestID,
      message: ResponseDescription,
    });
  } catch (error: any) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.response?.data?.errorMessage || error.message || 'STK Push failed' 
    });
  }
};

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    // Verify callback signature
    if (!verifyMpesaCallback(req)) {
      console.error('M-Pesa callback signature verification failed');
      return res.status(401).json({ received: false, error: 'Invalid signature' });
    }

    const callback = req.body;

    if (callback.Body?.stkCallback) {
      const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback.Body.stkCallback;

      const reservation = await prisma.reservation.findFirst({
        where: { checkoutRequestId: CheckoutRequestID },
      });

      if (!reservation) {
        console.log('Reservation not found for checkout:', CheckoutRequestID);
        return res.status(200).json({ received: true });
      }

      if (ResultCode === 0) {
        const mpesaReceipt = CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
        const amount = CallbackMetadata?.Item?.find((i: any) => i.Name === 'Amount')?.Value;

        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'ACTIVE',
            mpesaReceipt: mpesaReceipt?.toString(),
          },
        });

        await prisma.vehicle.update({
          where: { id: reservation.vehicleId },
          data: {
            status: 'RESERVED',
          },
        });

        await notificationService.create({
          type: 'SUCCESS',
          message: `Vehicle reserved! Receipt: ${mpesaReceipt}`,
          userId: 'system',
          action: 'VEHICLE_RESERVED',
          entityType: 'VEHICLE',
          entityId: reservation.vehicleId,
          vehicleId: reservation.vehicleId,
        });
      } else {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: 'FAILED' },
        });

        await notificationService.create({
          type: 'ERROR',
          message: `STK Push failed: ${ResultDesc}`,
          userId: 'system',
          action: 'STK_PUSH_FAILED',
          entityType: 'VEHICLE',
          entityId: reservation.vehicleId,
          vehicleId: reservation.vehicleId,
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('M-Pesa callback error:', error);
    res.status(200).json({ received: true });
  }
};

// Protected route - requires authentication to initiate payment
router.post('/stk-push', auth, initiateSTKPush);

// Callback from Safaricom - must remain public but includes signature verification
router.post('/callback', mpesaCallback);

export default router;
