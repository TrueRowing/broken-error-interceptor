import * as Express from 'express';
import * as _ from 'lodash';

import { ArgumentsHost, Catch, HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ROOT_LOGGER } from '../logging';
import { Bunyan } from '@eropple/nestjs-bunyan/index';

@Catch()
@Injectable({ scope: Scope.DEFAULT })
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
        const logger = ROOT_LOGGER.child({
            component: this.constructor.name,
            err,
            method: req.method,
            route: req.route.path,
            url: req.url,
        });
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
            logger.error('The error thrown in this HTTP call is not of subtype Error.');
        }
        if (400 <= body.status && body.status < 500) {
            logger.info({ body }, `Client error caught from ${req.url}.`);
        } else {
            logger.error({ body }, `Server error caught from ${req.url}.`);
        }
        res.status(body.status).json(body);
    }
}
