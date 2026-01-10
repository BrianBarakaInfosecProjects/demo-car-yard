import prisma from '../config/database';
import { InquiryInput } from '../utils/validators';

export const createInquiry = async (input: InquiryInput) => {
  const inquiry = await prisma.inquiry.create({
    data: input,
  });

  return inquiry;
};

export const getInquiries = async () => {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      vehicle: {
        select: {
          make: true,
          model: true,
          year: true,
          priceKES: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return inquiries;
};

export const updateInquiryStatus = async (id: string, status: string) => {
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: { status },
  });

  return inquiry;
};

export const deleteInquiry = async (id: string) => {
  const existingInquiry = await prisma.inquiry.findUnique({
    where: { id },
  });

  if (!existingInquiry) {
    throw new Error('Inquiry not found');
  }

  await prisma.inquiry.delete({
    where: { id },
  });

  return { message: 'Inquiry deleted successfully' };
};
