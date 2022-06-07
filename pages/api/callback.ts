import { env } from 'process';

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { createDiscordBotClient, createDiscordClient } from '../../lib/discord';

type Registration = {
  code: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

const Callback: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const accessTokenKey = Object.keys(req.cookies).find(
    key => key.startsWith('CognitoIdentityServiceProvider.') && key.endsWith('.accessToken'),
  );

  if (!accessTokenKey) {
    return void res.redirect('/?failed=' + encodeURIComponent('Could not find your access token.'));
  }

  const accessToken = req.cookies[accessTokenKey] as string;
  const jwks = jwksClient({
    jwksUri: env.AWS_COGNITO_JWKS_URL ?? '',
    getKeysInterceptor: () => JSON.parse(env.AWS_COGNITO_JWKS ?? '{}'),
  });

  try {
    await new Promise((resolve, reject) =>
      verify(
        accessToken,
        (header, callback) =>
          jwks.getSigningKey(header.kid, (err, key) => {
            callback(err, key?.getPublicKey());
          }),
        (err, payload) => (err ? reject(err) : resolve(payload)),
      ),
    );
  } catch (err) {
    return void res.redirect('/?failed=' + encodeURIComponent(err as string));
  }

  const register = req.query as Registration;
  const discordClient = createDiscordClient();
  const discordToken = await discordClient.getToken(register.code);
  const discordUser = await discordClient.authenticate(discordToken).getUser();
  const user: User = {
    id: discordUser.id,
    name: `${discordUser.username}#${discordUser.discriminator}`,
    email: discordUser.email,
    avatarUrl: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
  };

  const discordBotClient = createDiscordBotClient();
  await discordBotClient.putGuildMemberRole(env.DISCORD_GUILD_ID ?? '', user.id, env.DISCORD_ROLE_ID ?? '');
  await discordBotClient.postChannelMessage(
    env.DISCORD_CHANNEL_ID ?? '',
    `<@${user.id}> has been verified as a member!`,
  );

  res.redirect('/?success');
};

// noinspection JSUnusedGlobalSymbols
export default Callback;
