const { scenario } = require('@testduet/given-when-then');
const { expect } = require('expect');
const { applyMiddleware } = require('handler-chain');
const { afterEach, beforeEach, describe, it } = require('node:test');

scenario(
  'apply middleware',
  bdd =>
    bdd
      .given('2 middleware', () => [
        init => next => request => next(request + init) + 'a',
        init => next => request => next(request * init) + 'b'
      ])
      .when('applied', middleware => applyMiddleware(...middleware))
      .then('should become (x + y) * y', (_, fn) => {
        expect(fn(3)(request => '' + request)(1)).toBe('12ba');
      }),
  {
    afterEach,
    beforeEach,
    describe,
    it
  }
);
