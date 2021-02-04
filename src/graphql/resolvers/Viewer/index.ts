import crypto from 'crypto';
import { Response, Request } from 'express';
import { IResolvers } from 'apollo-server-express';
import { Database, User, Viewer } from '../../../lib/types';
import { Google } from '../../../lib/api';
import { LogInArgs } from './types';

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV !== 'development',
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response,
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

  res.cookie('viewer', userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  return viewer;
};

const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response,
): Promise<User | undefined> => {
  const updateRes = await db.users.findOneAndUpdate(
    {
      _id: req.signedCookies.viewer,
    },
    { $set: { token } },
    { returnOriginal: false },
  );

  const viewer = updateRes.value;

  if (!viewer) {
    res.clearCookie('viewer', cookieOptions);
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
      { db, req, res }: { db: Database; req: Request; res: Response },
    ): Promise<Viewer> => {
      try {
        const code = input?.code ?? null;
        const token = crypto.randomBytes(16).toString('hex');
        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);
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
    logOut: (_root: undefined, _args: {}, { res }: { res: Response }) => {
      try {
        res.clearCookie('viewer', cookieOptions);

        return { didRequest: true };
      } catch (error) {
        throw new Error(`Error on log out: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer) => viewer._id,
    hasWallet: (viewer: Viewer): boolean | undefined =>
      viewer.walletId ? true : undefined,
  },
};
