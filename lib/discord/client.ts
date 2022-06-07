import { env } from 'process';

import { Token, User as DiscordUser } from '.';

export class DiscordClient {
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly scopes: string[],
    private readonly redirectUri: string,
    private readonly grantType: string = 'authorization_code',
    public readonly baseUrl: string = 'https://discord.com/api/',
  ) {}

  authenticate(token: Token): DiscordUserClient {
    return new DiscordUserClient(this, token);
  }

  generateOAuthUrl(responseType = 'code'): string {
    const params = new URLSearchParams({
      response_type: responseType,
      client_id: this.clientId,
      scope: this.scopes.join(' '),
      redirect_uri: this.redirectUri,
    });

    return this.baseUrl + `oauth2/authorize?${params.toString()}`;
  }

  getToken(code: string): Promise<Token> {
    return fetch(this.baseUrl + 'oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: this.grantType,
        redirect_uri: this.redirectUri,
        scope: this.scopes.join(' '),
        code: code,
      }),
    })
      .then(response => response.json())
      .then(
        json =>
          <Token>{
            accessToken: json['access_token'],
            refreshToken: json['refresh_token'],
            expiresIn: json['expires_in'],
            tokenType: json['token_type'],
            scopes: json['scope']?.split(' '),
          },
      );
  }
}

export class DiscordUserClient {
  constructor(public readonly client: DiscordClient, private readonly token: Token) {}

  get<T>(endpoint: string): Promise<T> {
    return fetch(this.client.baseUrl + endpoint, {
      headers: {
        Authorization: `${this.token.tokenType} ${this.token.accessToken}`,
      },
    })
      .then(response => response.json())
      .then(json => json as T);
  }

  getUser(): Promise<DiscordUser> {
    return this.get<DiscordUser>('users/@me');
  }
}

export class DiscordBotClient {
  constructor(private readonly token: string, private readonly baseUrl: string = 'https://discord.com/api/') {}

  put<Req, Res>(endpoint: string, body?: Req): Promise<Res> {
    return fetch(this.baseUrl + endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bot ${this.token}`,
      },
    })
      .then(response => response.json())
      .then(json => json as Res);
  }

  putGuildMemberRole(guildId: string, userId: string, roleId: string) {
    return this.put(`guilds/${guildId}/members/${userId}/roles/${roleId}`);
  }
}

export const createDiscordClient = (): DiscordClient => {
  return new DiscordClient(
    env.DISCORD_CLIENT_ID ?? '',
    env.DISCORD_CLIENT_SECRET ?? '',
    ['identify', 'email'],
    env.DISCORD_CALLBACK_URL ?? '',
  );
};

export const createDiscordBotClient = (): DiscordBotClient => {
  return new DiscordBotClient(env.DISCORD_BOT_TOKEN ?? '');
};