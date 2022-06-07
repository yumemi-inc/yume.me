import { env } from 'process';

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

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
  const register = req.body as Registration;
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

  res.redirect('/?success');
};

// noinspection JSUnusedGlobalSymbols
export default Callback;
