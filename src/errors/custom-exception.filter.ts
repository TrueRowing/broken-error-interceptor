import * as Express from 'express';
import * as _ from 'lodash';

import { ArgumentsHost, Catch, HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
@Injectable({ scope: Scope.REQUEST })
export class CustomExceptionFilter extends BaseExceptionFilter {

    async catch(err: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res: Express.Response = ctx.getResponse();
        const req = ctx.getRequest();
        this.logError(err, req, res);
        ctx.getNext();
    }

    private logError(
        err: unknown,
        req: any,
        res: Express.Response,
    ): void {
        const body: { [key: string]: any } = {
            status: 500,
            path: req.url,
        };
        // we don't want to munge the stack multiple times if we can avoid it.
        let errorStack: Array<string> | undefined;
        if (this.isExceptionObject(err)) {
            // we'll skip the first entry as it's not really meaningful
            errorStack = err.stack
                ? _.chain(err.stack.split('\n')).drop(1).map((s: string) => s.trim()).value()
                : [];
            body.errorName = err.name;
            body.message = err.message;
            body.stack = errorStack;
            if (err instanceof HttpException) {
                body.status = err.getStatus();
                body.message = err.message;
            }
        } else {
            // this will be right above the actual error in any search by correlation ID,
            // so I don't feel like we need to repeat the error here.
            console.error('The error thrown in this HTTP call is not of subtype Error.');
        }
        const logContext: { [key: string]: any } = {
            body,
            err,
            method: req.method,
            route: req.route.path,
            url: req.url,
        };
        if (400 <= body.status && body.status < 500) {
            console.info(`Client error caught from ${req.url}.`, logContext);
        } else {
            console.error(`Server error caught from ${req.url}.`, logContext);
        }
        res.status(body.status).json(body);
    }
}
