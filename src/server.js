require('dotenv').config()

import sirv from 'sirv';
// import polka from 'polka';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const app = express();

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

app.use(express.urlencoded());
app.use(express.json());

// polka() // You can also use Express
// 	.use(
// 		compression({ threshold: 0 }),
// 		sirv('static', { dev }),
// 		sapper.middleware()
// 	)
// 	.listen(PORT, err => {
// 		if (err) console.log('error', err);
// 	});

app.use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware()
  )
  .listen(PORT,
    console.log(`🚀 Server ready at: http://localhost:${PORT}`),
    err => {
      if (err) console.log('error', err);
    });