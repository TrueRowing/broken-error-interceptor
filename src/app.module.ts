import { LoggingModule } from '@eropple/nestjs-bunyan';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ErrorsModule } from './errors/errors.module';
import { JsonBodyParserMiddleware } from './json-body-parser.middleware';
import { MetaModule } from './meta/meta.module';
import { decorateRequestLogger, ROOT_LOGGER } from './logging';

@Module({
    imports: [
        // system-level modules; order shouldn't matter, but let's be conservative.
        LoggingModule.forRoot(ROOT_LOGGER, {
            skipRequestInterceptor: false,
            postRequestCreate: decorateRequestLogger,
        }),
        ErrorsModule,
        MetaModule,
    ],
    controllers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer
            .apply(JsonBodyParserMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
