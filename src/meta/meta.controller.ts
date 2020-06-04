import { Bunyan, Logger } from '@eropple/nestjs-bunyan';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PingResponse } from './domain';

@Controller('meta')
export class MetaController {

    readonly logger: Bunyan;

    constructor(
        @Logger() logger: Bunyan,
    ) {
        this.logger = logger.child({ component: this.constructor.name });
    }

    @Get('ping')
    async ping() {
        this.logger.info({ pingType: 'ping' }, 'Will return this: Pong!');
        return new PingResponse('Pong!');
    }

    @Get('fail')
    fail() {
        this.logger.info({ pingType: 'fail'}, 'Will throw an error.');
        throw new Error('You expected this.');
    }

    @Post('echo')
    async echo(
        @Body() body: { value: string },
    ) {
        this.logger.info({ pingType: 'echo' }, `Will return this: ${body.value}`);
        return new PingResponse(body.value);
    }
}
