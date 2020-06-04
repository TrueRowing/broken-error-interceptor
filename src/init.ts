import { INestApplication, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    BunyanLoggerService,
    CorrelationIdMiddleware,
} from '@eropple/nestjs-bunyan';

import 'source-map-support/register';

import { ROOT_LOGGER } from './logging';
import { AppModule } from './app.module';

export function getAppOptions(): NestApplicationOptions {
    return {
        logger: new BunyanLoggerService(ROOT_LOGGER),
        bodyParser: false,
    };
}

/**
 * Builds a standard application (i.e., non-testing) for use
 * by the NestJS runner.
 */
export async function buildApp(rootModule: any): Promise<INestApplication> {
    return NestFactory.create(rootModule, getAppOptions());
}

export interface ConfigureAppArgs {
    readonly app: INestApplication;
}

/**
 * The canonical application that should be launched run by `main.ts` should
 * be defined here (and only here).
 */
export async function buildMainApp() {
    return await buildApp(AppModule);
}
