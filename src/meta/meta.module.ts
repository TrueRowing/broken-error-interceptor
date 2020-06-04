import { Module } from '@nestjs/common';

import { ErrorsModule } from '../errors/errors.module';
import { MetaController } from './meta.controller';

@Module({
    imports: [ErrorsModule],
    controllers: [MetaController],
    providers: [],
    exports: [],
})
export class MetaModule {}
