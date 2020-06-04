import { json } from 'body-parser';
import { Request, Response } from 'express';

import { NestMiddleware } from '@nestjs/common';

export class JsonBodyParserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        json()(req, res, next);
    }
}
