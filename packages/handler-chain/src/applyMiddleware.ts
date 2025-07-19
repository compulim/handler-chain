import composeEnhancer from './composeEnhancer.ts';
import { type Middleware } from './types.ts';

export default function applyMiddleware<Result, Request, Init>(
  ...middleware: readonly Middleware<Result, Request, Init>[]
): Middleware<Result, Request, Init> {
  return (init: Init) => composeEnhancer(...middleware.map(middleware => middleware(init)));
}
