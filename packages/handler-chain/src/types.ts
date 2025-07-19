type Handler<Result, Request> = (request: Request) => Result;
type Enhancer<Result, Request> = (next: Handler<Result, Request>) => Handler<Result, Request>;
type Middleware<Result, Request, Init> = (init: Init) => Enhancer<Result, Request>;

export { type Enhancer, type Handler, type Middleware };
