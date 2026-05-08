import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../prisma/client';
import { config } from '../config';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

const getMpesaAuth = async () => {
  const authUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const credentials = Buffer.from(`${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`).toString('base64');
  const response = await axios.get(authUrl, { headers: { Authorization: `Basic ${credentials}` } });
  return response.data.access_token;
};

export const initiateStkPush = async (req: AuthRequest, res: Response) => {
  const { phone, amount, jobId } = req.body;
  try {
    const userId = req.user?.id;
    const payment = await prisma.payment.create({
      data: { userId: userId!, jobId, amount, phone },
    });

    const accessToken = await getMpesaAuth();
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = Buffer.from(`${config.mpesa.shortcode}${config.mpesa.passkey}${timestamp}`).toString('base64');
    const stkUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const response = await axios.post(
      stkUrl,
      {
        BusinessShortCode: config.mpesa.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: config.mpesa.shortcode,
        PhoneNumber: phone,
        CallBackURL: `${req.protocol}://${req.get('host')}/api/payments/callback`,
        AccountReference: `BackendTalex-${payment.id}`,
        TransactionDesc: 'Job application fee',
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const checkoutRequestId = response.data.CheckoutRequestID || response.data.checkoutRequestID;
    if (checkoutRequestId) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { checkoutRequestId },
      });
    }

    res.json(successResponse('STK push initiated', { paymentId: payment.id, checkoutRequestId }));
  } catch (error) {
    res.status(500).json(errorResponse('STK push failed', error));
  }
};

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const callback = req.body;
    const callbackMetadata = callback.Body?.stkCallback;
    if (!callbackMetadata) {
      return res.status(400).json({ success: false, message: 'Invalid callback payload' });
    }

    const checkoutRequestID = callbackMetadata.CheckoutRequestID;
    const resultCode = callbackMetadata.ResultCode;
    const mpesaResponse = callbackMetadata.CallbackMetadata?.Item || [];

    if (resultCode === 0) {
      const mpesaCodeItem = mpesaResponse.find((item: any) => item.Name === 'MpesaReceiptNumber');
      const amountItem = mpesaResponse.find((item: any) => item.Name === 'Amount');
      const phoneItem = mpesaResponse.find((item: any) => item.Name === 'PhoneNumber');

      const payment = await prisma.payment.update({
        where: { checkoutRequestId: checkoutRequestID },
        data: {
          status: 'SUCCESS',
          mpesaCode: mpesaCodeItem?.Value,
          amount: Number(amountItem?.Value) || 500,
          phone: phoneItem?.Value || '',
        },
      });
      return res.json({ success: true, payment });
    }

    res.json({ success: false, message: 'Payment failed' });
  } catch (error) {
    res.status(500).json(errorResponse('Callback processing failed', error));
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.body;
  try {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      return res.status(404).json(errorResponse('Payment not found'));
    }
    res.json(successResponse('Payment verified', { payment }));
  } catch (error) {
    res.status(500).json(errorResponse('Verification failed', error));
  }
};
