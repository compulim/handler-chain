import { scenario } from '@testduet/given-when-then';
import expect from 'expect';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { applyMiddleware } from './index.ts';

scenario(
  'a web server sample scenario',
  bdd =>
    bdd
      .given(
        'a web server',
        () => {
          const middleware = applyMiddleware<void, { req: IncomingMessage; res: ServerResponse }, string>(
            init =>
              next =>
              ({ req, res }) => {
                if (req.headers.accept === 'text/event-stream') {
                  res.end(`data: ${init}\n\n`);
                } else {
                  next({ req, res });
                }
              },
            init =>
              next =>
              ({ req, res }) => {
                if (req.headers.accept === 'application/json') {
                  res.end(JSON.stringify(init));
                } else {
                  next({ req, res });
                }
              }
          );

          const handle = middleware('Hello, World!')(({ res }) => {
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
  {
    afterEach,
    beforeEach,
    describe,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    it: it as any
  }
);
