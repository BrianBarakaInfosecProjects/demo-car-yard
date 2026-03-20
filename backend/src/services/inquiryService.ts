import prisma from '../config/database';
import { InquiryInput } from '../utils/validators';

export const createInquiry = async (input: InquiryInput) => {
  // Only include fields that are defined and valid
  const data: any = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
  };
  
  // Only add vehicleId if it's a valid UUID
  if (input.vehicleId && input.vehicleId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    data.vehicleId = input.vehicleId;
  }
  
  // Only add userId if it's a valid UUID and exists in the database
  if (input.userId && input.userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    const userExists = await prisma.user.findUnique({ where: { id: input.userId } });
    if (userExists) {
      data.userId = input.userId;
    }
  }
  
  const inquiry = await prisma.inquiry.create({
    data,
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
