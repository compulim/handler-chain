const { scenario } = require('@testduet/given-when-then');
const { expect } = require('expect');
const { applyMiddleware } = require('handler-chain');
const nodeTest = require('node:test');

scenario(
  'apply middleware',
  bdd =>
    bdd
      .given('2 middleware', () => {
        /** @type {import('handler-chain').Middleware<string, number, number>[]} */
        const middleware = [
          init => next => request => next(request + init) + 'a',
          init => next => request => next(request * init) + 'b'
        ];

        return middleware;
      })
      .when('applied', middleware => applyMiddleware(...middleware))
      .then('should become (x + y) * y', (_, fn) => {
        expect(fn(3)(request => '' + request)(1)).toBe('12ba');
      }),
  nodeTest
);
