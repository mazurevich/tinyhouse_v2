import { connectDatabase } from '../src/database';

require('dotenv').config();

const clear = async () => {
  try {
    const db = await connectDatabase();
    const bookings = await db.bookings.find({}).toArray();
    const listings = await db.listings.find({}).toArray();
    const users = await db.users.find({}).toArray();

    if (bookings.length) {
      await db.bookings.drop();
    }
    if (listings.length) {
      await db.listings.drop();
    }
    if (users.length) {
      await db.users.drop();
    }
  } catch (e) {
    throw new Error(`Failed to delete data.${  e.message}`);
  }
};

clear();
