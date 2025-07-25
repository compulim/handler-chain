import { scenario } from '@testduet/given-when-then';
import expect from 'expect';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import * as nodeTest from 'node:test';
import { composeEnhancer } from './index.ts';

scenario(
  'a web server sample scenario',
  bdd =>
    bdd
      .given(
        'a web server',
        () => {
          const enhancer = composeEnhancer<void, { req: IncomingMessage; res: ServerResponse }>(
            next =>
              ({ req, res }) => {
                if (req.headers.accept === 'text/event-stream') {
                  res.end('data: Hello, World!\n\n');
                } else {
                  next({ req, res });
                }
              },
            next =>
              ({ req, res }) => {
                if (req.headers.accept === 'application/json') {
                  res.end('"Hello, World!"');
                } else {
                  next({ req, res });
                }
              }
          );

          const handle = enhancer(({ res }) => {
            // If no "Accept" header is present, respond with 406 Not Acceptable.
            res.statusCode = 406;
            res.end();
          });

          const app = createServer((req, res) => handle({ req, res }));

          app.listen();

          const address = app.address();

          return {
            app,
            url: !address
              ? 'http://localhost'
              : typeof address === 'string'
                ? `http://${address}`
                : `http://localhost:${address.port}`
          };
        },
        ({ app }) => {
          app.closeAllConnections();
          app.close();
        }
      )
      .when('received a Server-Sent Event client request', ({ url }) =>
        fetch(url, {
          headers: {
            accept: 'text/event-stream'
          }
        })
      )
      .then('should receive a Server-Sent Event response', (_, res) =>
        expect(res.text()).resolves.toBe('data: Hello, World!\n\n')
      )
      .when('received a JSON client request', ({ url }) =>
        fetch(url, {
          headers: {
            accept: 'application/json'
          }
        })
      )
      .then('should receive a JSON response', (_, res) => expect(res.text()).resolves.toBe('"Hello, World!"'))
      .when('received a client request with "Accept" header', ({ url }) => fetch(url))
      .then('should receive 406', (_, res) => expect(res.status).toBe(406)),
  nodeTest
);
