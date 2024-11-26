# pyramids

> timetabling for uni students and society members, made easy.

## installation

1. `cd backend && pnpm i`
2. set the following values in `backend/.env`:

```bash
SESSION_SECRET=
NODE_ENV=development
ALLOWED_ORIGINS=commaseparated,regexes,slashesnotrequired
DATABASE_URL="postgresql://.../postgres?pgbouncer=true"
DIRECT_URL="postgresql://.../postgres"
REDIS_PORT=6379
```

`NODE_ENV` may be either 'development' or 'production'.

3. `cd ../frontend && pnpm i`
4. set the following values in `frontend/.env`:

```bash
TODO
```

5. _optionally_, create a .env file at the root of the repository (ie. not in `trainee-fool-24t3/frontend` or `trainee-fool-24t3/backend`, but `trainee-fool-24t3`).
6. assuming you did step 5, include your corresponding cloudflare deploy hook endpoint inside this file.

```bash
echo "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/ENDPOINT_GOES_HERE" > .env
```

you can now use the `rebuild` script in the root of the repository to initiate manual deployments without having to push changes to `main`.

## running

### backend

1. `cd backend`
2. `docker run -d --name redis-stack-server -p <REDIS_PORT>:6379 redis/redis-stack-server:latest`
3. `pnpm run start`

### frontend

1. `cd frontend`
2. `pnpm run dev`

## testing

to run tests locally, follow the steps below.

1. create a new file called .env.test in the backend folder. Set the following values:

```
DATABASE_URL="postgres://postgres:postgres@localhost:5432"
DIRECT_URL="postgres://postgres:postgres@localhost:5432"
NODE_ENV=test
REDIS_PORT=6380
SESSION_SECRET=notsecret
```

2. ensure you have docker _and_ docker-compose installed and make sure you have the docker engine running.

3. make sure that the tests you've written are in the tests directory. You can then run these tests by running:

```
pnpm run test:int
```

> ⚠️ note that docker-compose or docker may require root privileges to run. any errors pertaining to either of things that appear when running the above scripts can probably be resolved by using `su`.

## setting up the discord bot

if you're not interested in self-hosting, you can invite the pyramids discord bot [here](https://discord.com/oauth2/authorize?client_id=1301423026633445447&permissions=17600776112128&integration_type=0&scope=applications.commands+bot).

1. `cd discord && pnpm i`
2. create an application in the [discord developer portal](https://discord.com/developers/applications).
3. set the following values in `discord/.env` to match those noted in the discord developer portal for your new app. note that `SERVER_ID` is optional and only needs to be set if you're running `pnpm run cmds test`, which ensures changes to the bot's commands only affect a single server. the value you enter for `REDIS_PORT` should be the same as the one you entered in `backend/.env`.

```bash
APPLICATION_ID=
BOT_TOKEN=
SERVER_ID=
REDIS_PORT=
```

4. `pnpm run cmds public` to establish the commands, then `pnpm run bot` to start the bot.

## credits

- aaron fang
- isaac kim
- jared schulz
- lachlan shoesmith
- ricky pham
- vincent tannos

- pyramid icon by [liam gabe](https://thenounproject.com/icon/pyramid-7276619/)
