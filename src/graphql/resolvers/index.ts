import _ from 'lodash';
import { viewerResolvers } from './Viewer';
import { userResolvers } from './User';

export const resolvers = _.merge(viewerResolvers, userResolvers);
