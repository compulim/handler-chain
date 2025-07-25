import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import * as nodeTest from 'node:test';
import applyMiddleware from './applyMiddleware.ts';
import { type Middleware } from './types.ts';

scenario(
  'apply middleware',
  bdd =>
    bdd
      .given('2 middleware', (): Middleware<string, number, number>[] => [
        init => next => request => next(request + init) + 'a',
        init => next => request => next(request * init) + 'b'
      ])
      .when('applied', middleware => applyMiddleware(...middleware))
      .then('should become (x + y) * y + "b" + "a"', (_, middleware) => {
        expect(middleware(3)(request => '' + request)(1)).toBe('12ba');
      }),
  nodeTest
);

scenario(
  'apply no middleware',
  bdd =>
    bdd
      .given('no middleware', (): Middleware<string, number, number>[] => [])
      .when('applied', middleware => applyMiddleware(...middleware))
      .then('should become x + ""', (_, middleware) => {
        expect(middleware(3)(request => '' + request)(1)).toBe('1');
      }),
  nodeTest
);
