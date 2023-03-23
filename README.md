# foodstats-server

deployed at https://foodstats.net/

production deployment instructions:
1. add .env with `KEY=<API_KEY>` , `DIST=true`
2. to start server run `npm run build` , `pm2 start dist/index.js --name foodstats`
