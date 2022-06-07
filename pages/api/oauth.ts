import { NextApiRequest, NextApiResponse } from 'next';

import { createDiscordClient } from '../../lib/discord';

const Oauth = (req: NextApiRequest, res: NextApiResponse): void => {
  const client = createDiscordClient();

  res.redirect(client.generateOAuthUrl());
};

// noinspection JSUnusedGlobalSymbols
export default Oauth;
