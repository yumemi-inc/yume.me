import { Auth } from '@aws-amplify/auth';
import { useEffect, useState } from 'react';

export type User = {
  name: string;
  email: string;
  picture: string;
};

export const getCurrentUser = async (): Promise<User> => {
  const session = await Auth.currentSession();
  const idToken = session.getIdToken().decodePayload() as User;

  return {
    name: idToken.name,
    email: idToken.email,
    picture: idToken.picture,
  };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getCurrentUser().then(u => setUser(u));
  }, [setUser]);

  return user;
};
