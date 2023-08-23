# foodstats-server

deployed at https://foodstats.net/

production deployment instructions:

1. clone repository
2. install dependencies

```shell
npm i
```

3. add .env with `KEY=<API_KEY>` , `DIST=true`
4. to start server run `npm run build` , `pm2 start dist/index.js --name foodstats`
