import * as express from 'express';

import Application from './common/Application';

const PORT = 3000;

const expressApp = express();
const app = new Application();


expressApp.get('/api/:controller.:method', async (req, res) => {
  console.log('Request:', req.params.controller, req.params.method, req.query);
  const data = await app.execApi(
    req.params.controller,
    req.params.method,
    req.query,
  );
  console.log('Response:', JSON.stringify(data));
  res.send(data);
});

app.Ready.then(async () => {
  console.log(await app.execApi('proposalApi', 'getProposal', 123, 321));
  expressApp.listen(3000, () => {
    console.log(`Server listening on ${PORT} port`);
  });
});
