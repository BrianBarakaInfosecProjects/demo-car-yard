import { Request, Response } from 'express';
import * as inquiryService from '../services/inquiryService';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({
      success: true,
      inquiry,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'CREATE_INQUIRY_ERROR',
      },
    });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await inquiryService.getInquiries();
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const inquiry = await inquiryService.updateInquiryStatus(req.params.id, req.body.status);
    res.json(inquiry);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const result = await inquiryService.deleteInquiry(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
