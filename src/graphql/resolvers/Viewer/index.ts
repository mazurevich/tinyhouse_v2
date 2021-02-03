import crypto from 'crypto';
import { IResolvers } from 'apollo-server-express';
import { Database, User, Viewer } from '../../../lib/types';
import { Google } from '../../../lib/api';
import { LogInArgs } from './types';

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
): Promise<User | undefined> => {
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error('Google login error');
  }

  // names/photos/ email
  const userName = (user?.names ?? [])[0]?.displayName || null;
  const userId = (user?.names ?? [])[0]?.metadata?.source?.id || null;
  const userAvatar = (user?.photos ?? [])[0]?.url || null;
  const userEmail = (user?.emailAddresses ?? [])[0]?.value || null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error('Google login error');
  }

  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false },
  );

  let viewer = updateRes.value;
  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });
    [viewer] = insertResult.ops;
  }

  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: () => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db }: { db: Database },
    ): Promise<Viewer> => {
      try {
        const code = input?.code ?? null;
        const token = crypto.randomBytes(16).toString();
        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db)
          : undefined;
        if (!viewer) {
          return { didRequest: true };
        }
        const { _id, avatar, walletId } = viewer;
        return {
          _id,
          token: viewer.token,
          avatar,
          walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut: () => {
      try {
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Error on log out: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer) => viewer._id,
    hasWallet: (viewer: Viewer): boolean | undefined => (viewer.walletId ? true : undefined),
  },
};
