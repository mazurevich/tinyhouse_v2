import { IResolvers } from 'apollo-server-express';
import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { Listing, Database, User } from '../../../lib/types';
import { ListingArgs, ListingBookingArgs, ListingBookingData } from './types';
import { authorize } from '../../../lib/utils';

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db, req }: { db: Database; req: Request },
    ): Promise<Listing | undefined> => {
      const listing = await db.listings.findOne({ _id: new ObjectId(id) });
      if (!listing) {
        throw new Error('Listing could not be found!');
      }

      const viewer = await authorize(db, req);
      if (viewer && viewer._id === listing.host) {
        listing.authorized = true;
      }

      return listing;
    },
  },

  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
    host: async (
      listing: Listing,
      _args: {},
      { db }: { db: Database },
    ): Promise<User> => {
      try {
        const host = await db.users.findOne({ _id: listing.host });

        if (!host) {
          throw new Error("Host can't be found.");
        }
        return host;
      } catch (error) {
        throw new Error(`Error while searching host user of listing: ${error}`);
      }
    },
    bookingsIndex: (listing: Listing): string =>
      JSON.stringify(listing.bookingsIndex),
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingArgs,
      { db }: { db: Database },
    ): Promise<ListingBookingData | null> => {
      try {
        if (!listing.authorized) {
          return null;
        }

        const data: ListingBookingData = {
          total: 0,
          result: [],
        };

        let cursor = db.bookings.find({ _id: { $in: listing.bookings } });

        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Error while fetching listing booking: ${error}`);
      }
    },
  },
};
