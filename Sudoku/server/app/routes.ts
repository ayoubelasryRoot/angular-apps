import * as express from 'express';

module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.writeHead(301,
        { Location: 'http://localhost:3000/dashboard' }
      );
      res.end();
    }
  }
}

export = Route;
