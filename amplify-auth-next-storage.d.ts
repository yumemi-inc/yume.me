module 'amplify-auth-next-storage' {
  import { ICognitoStorage } from 'amazon-cognito-identity-js';

  type NextStorageOptions = {
    domain: string;
    expires?: number;
    path?: string;
    secure?: boolean;
  };

  export default class NextStorage implements ICognitoStorage {
    constructor(ctx?: unknown, options?: NextStorageOptions);

    setItem(key: string, value: string);
    getItem(key: string);
    removeItem(key: string);
    clear();
  }
}
