import { type Enhancer, type Handler } from './types.ts';

export default function composeEnhancer<Result, Request>(
  ...enhancers: Enhancer<Result, Request>[]
): Enhancer<Result, Request> {
  return (fallbackHandler: Handler<Result, Request>): Handler<Result, Request> =>
    enhancers.reduceRight((chain, enhancer) => enhancer(chain), fallbackHandler);
}
