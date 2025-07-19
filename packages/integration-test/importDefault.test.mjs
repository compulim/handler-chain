import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import { applyMiddleware } from 'handler-chain';
import { afterEach, beforeEach, describe, it } from 'node:test';

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
