import { Module, Scope } from '@nestjs/common';
import { APP_FILTER, REQUEST } from '@nestjs/core';

import { CustomExceptionFilter } from './custom-exception.filter';

@Module({
    imports: [],
    providers: [
        { provide: APP_FILTER, scope: Scope.REQUEST, useClass: CustomExceptionFilter },
    ],
    exports: [],
})
export class ErrorsModule { }
