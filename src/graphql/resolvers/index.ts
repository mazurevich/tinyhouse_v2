import _ from 'lodash';
import { viewerResolvers } from './Viewer';
import { userResolvers } from './User';
import { listingResolvers } from './Listing';
import { bookingResolvers } from './Booking';

export const resolvers = _.merge(
  viewerResolvers,
  userResolvers,
  listingResolvers,
  bookingResolvers,
);
