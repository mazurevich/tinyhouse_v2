import { Booking } from '../../../lib/types';

export interface ListingBookingArgs {
  limit: number;
  page: number;
}

export interface ListingBookingData {
  total: number;
  result: Booking[];
}

export interface ListingArgs {
  id: string;
}
