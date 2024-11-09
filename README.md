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

7. To run tests, create a new file called .env.test in the backend folder. Set the following values:
```
DATABASE_URL="postgres://postgres:postgres@localhost:5432"
DIRECT_URL="postgres://postgres:postgres@localhost:5432"
NODE_ENV=test
```

## credits

- aaron fang
- isaac kim
- jared schulz
- lachlan shoesmith
- ricky pham
- vincent tannos

- pyramid icon by [liam gabe](https://thenounproject.com/icon/pyramid-7276619/)
