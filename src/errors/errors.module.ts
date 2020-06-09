import { Module, Scope } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { CustomExceptionFilter } from './custom-exception.filter';

@Module({
    imports: [],
    providers: [
        { provide: APP_FILTER, scope: Scope.DEFAULT, useClass: CustomExceptionFilter },
    ],
    exports: [],
})
export class ErrorsModule { }
