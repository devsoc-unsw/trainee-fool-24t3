# pyramids

> timetabling for uni students and society members, made easy.

## installation

1. `cd backend && pnpm i`
2. set the following values in `backend/.env`:

```bash
SESSION_SECRET=
NODE_ENV=development
ALLOWED_ORIGINS=commaseparated,regexes,slashesnotrequired
DATABASE_URL="postgresql://..."
```

`NODE_ENV` may be either 'development' or 'production'

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

### setting up the discord bot

if you're not interested in self-hosting, you can invite the pyramids discord bot [here](https://discord.com/oauth2/authorize?client_id=1301423026633445447&permissions=17600776112128&integration_type=0&scope=applications.commands+bot).

1. `cd discord && pnpm i`
2. create an application in the [discord developer portal](https://discord.com/developers/applications).
3. set the following values in `discord/.env` to match those noted in the discord developer portal for your new app:

```bash
APPLICATION_ID=
PUBLIC_KEY=
BOT_TOKEN=
```

4. `pnpm run cmds` to establish the commands, then `pnpm run bot` to start the bot.

## credits

* aaron fang
* isaac kim
* jared schulz
* lachlan shoesmith
* ricky pham
* vincent tannos

* pyramid icon by [liam gabe](https://thenounproject.com/icon/pyramid-7276619/)
