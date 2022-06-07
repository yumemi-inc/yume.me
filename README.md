# YUME@me
Verifies membership of Google Workspace for joining Discord guilds as a member themselves.


## ✅ Prerequisites
- Node.js v17
- Next.js v12
  - Use Next.js v11 instead on AWS Amplify (see https://github.com/aws-amplify/amplify-hosting/issues/2343)

## ✨ Getting Started
```sh
pnpm install

# Runs a development server
pnpm dev

# Builds entire the project to deploy
pnpm build
```

## 📦 Deployment for AWS Amplify
Use the following build config to deploy this project onto AWS Amplify instead of Vercel.
If you have no reason for that, use Vercel.

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
        - env > .env.local
    build:
      commands:
        - pnpm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## 🙌 We're hiring!
See https://hrmos.co/pages/yumemi .
