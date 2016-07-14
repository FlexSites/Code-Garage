'use strict';

const express = require('express');
const json = require('body-parser').json;
const cors = require('cors');
const assert = require('assert');
const uuid = require('uuid');
const sortBy = require('lodash.sortby');

const Redis = require('redis');
const redis = Redis.createClient();

const s3 = require('./services/S3');

const alphabet = 'AJUWL$F7!4T3H1YZ2XG&@PV8BK9?RNDMLCQE6';

const Cipher = require('./cipher');
const cipher = new Cipher(alphabet);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('config');

const app = express();


app.use(cors());
app.use(json());

let id = 1225;
let str = '';

while(str.length <= 3) {
  str = cipher.encode(id++);
  if (id - 1 !== cipher.decode(str)) console.log('Failure', id - 1, str, cipher.decode(str));
}

// ?ML
// ?8L
// ?PL

app.get('/keys', (req, res, next) => {
  res.send([uuid.v4()]);
});

app.post('/tokens', json(), (req, res, next) => {
  let body = req.body;
  let expires = Date.now() + (60 * 60 * 24);
  if (body.expires) {
    // Default expiration 24hrs
    expires = body.expires;
  }
  id++;

  let uniq = uuid.v4();
  let token = cipher.encode(id);
  s3.put(uniq, JSON.stringify(body))
    .then((Key) => {
      console.log("saved to key", Key);
      body.id = token;
      redis.set(token, JSON.stringify({ Key }));
      redis.expire(token, expires);
    })
    .catch(ex => console.error('bad shit', ex));


  console.log(cipher.decode(token), token);

  assert(!!body.value, 'Field "value" must be set.');
  assert(Array.isArray(body.questions), 'Field "questions" must be an array.');

  res.send(token);
});

app.get('/tokens/:token', (req, res, next) => {
  redis.get(req.params.token, (err, value) => {
    let data = JSON.parse(value);
    console.log(err, data);
    s3.get(data.Key)
      .then(results => {
        let fin = JSON.parse(results.Body.toString('utf8'));
        res.send(fin)
      })
      .catch(ex => console.error(ex));
  });
});

app.listen(3000);
