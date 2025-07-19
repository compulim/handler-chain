# `handler-chain`

A generic [chain of responsibility design pattern](https://refactoring.guru/design-patterns/chain-of-responsibility).

## Background

The chain of responsibility design pattern is useful for dividing responsibility in the system. As a benefit, it would allow the system to be reconfigured easily.

In JavaScript, chain of responsibility is often used interchangeably with middleware. Express and Redux made the chain of responsibility design pattern popular.

However, implementation varies. This package is designed to codify the design pattern.

<!--
## Demo

Click here for [our live demo](https://compulim.github.io/handler-chain/).
-->

## How to use?

### Enhancer

In the following example, we are using an enhancer to handle web requests.

```ts
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
```

The server would serve the string "Hello, World!" in either Server-Sent Event or JSON format based on the "Accept" header. If no "Accept" header is present, it would respond with HTTP response code 406.

### Middleware

Bringing the sample above forward, instead returning a hardcoded string in each enhancer, the following example use `applyMiddleware()` to initialize the enhancers with prepopulated content.

```tsx
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
```

## API

Terminlogy:

- Handler: handle a single request and return the result
- Enhancer: a handler, with next handler
- Middleware: an enhancer, with initializer

```ts
type Handler<Result, Request> = (request: Request) => Result;
type Enhancer<Result, Request> = (next: Handler<Result, Request>) => Handler<Result, Request>;
type Middleware<Result, Request, Init> = (init: Init) => Enhancer<Result, Request>;

function composeEnhancer<Result, Request>(
  ...enhancers: Enhancer<Result, Request>[]
): Enhancer<Result, Request>;

function applyMiddleware<Result, Request, Init>(
  ...middleware: readonly Middleware<Result, Request, Init>[]
): Middleware<Result, Request, Init>;
```

## Behaviors

### Differences between middleware and enhancer

Middleware is factory of enhancer. At 10,000 feet of view, middleware makes enhancer more customizable.

### Difference between the pattern used in this package and Express and Redux

- Naming
   - We adopted naming system largely from Redux: middleware and enhancer
   - Express has no "middleware". Express middleware is our enhancer
- Data flow
   - Both Express and Redux middleware do not have return flow, data is flow unidirectionally from the first middleware
   - `handler-chain` middleware allows return flow and behaves like a JavaScript function, data is flow from the first middleware to the last one, then the result is returned from the last middleware to the first one
- Enhancer signature
   - Express: `(req, res, next) => void`
   - Redux: `next => action => void`
   - `handler-chain`: `next => action => result`
- Async support
   - Both Express and Redux middleware allows async
   - `handler-chain` currently does not support async (this may change in the future)

## Contributions

Like us? [Star](https://github.com/compulim/handler-chain/stargazers) us.

Want to make it better? [File](https://github.com/compulim/handler-chain/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/handler-chain/pulls) a pull request.
