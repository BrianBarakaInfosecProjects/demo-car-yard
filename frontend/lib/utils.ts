import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return 'KSh ' + price.toLocaleString();
};

export const formatStatus = (status: string) => {
  return status.replace('_', ' ');
};

export const getSeatsCount = (bodyType: string, model: string) => {
  if (bodyType === 'SUV' && ['Telluride', 'Atlas', 'Explorer'].includes(model)) {
    return 7;
  }
  return 5;
};

export const getStatusClass = (status: string) => {
  switch (status) {
    case 'FEATURED':
      return 'bg-danger';
    case 'ON_SALE':
      return 'bg-warning text-dark';
    case 'CERTIFIED_PRE_OWNED':
      return 'bg-success';
    case 'NEW':
      return 'bg-primary';
    default:
      return 'bg-secondary';
  }
};
