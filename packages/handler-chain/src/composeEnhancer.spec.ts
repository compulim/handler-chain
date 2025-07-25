import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import * as nodeTest from 'node:test';
import composeEnhancer from './composeEnhancer.ts';
import { type Enhancer } from './types.ts';

scenario(
  'compose enhancer',
  bdd =>
    bdd
      .given('2 enhancers', (): Enhancer<string, number>[] => [
        next => request => next(request + 1) + 'a',
        next => request => next(request * 10) + 'b'
      ])
      .when('composed', middleware => composeEnhancer(...middleware))
      .then('should become (x + 1) * 10 + "b" + "a"', (_, enhancer) => {
        expect(enhancer(request => '' + request)(2)).toBe('30ba');
      }),
  nodeTest
);

scenario(
  'compose no enhancers',
  bdd =>
    bdd
      .given('no enhancers', (): Enhancer<string, number>[] => [])
      .when('composed', middleware => composeEnhancer(...middleware))
      .then('should become x + ""', (_, enhancer) => {
        expect(enhancer(request => '' + request)(1)).toBe('1');
      }),
  nodeTest
);
