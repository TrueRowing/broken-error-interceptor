import * as http from 'http';
import * as superTest from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { getAppOptions } from '../../src/init';

describe('Meta controller', () => {

    let module: TestingModule;
    let app: INestApplication;

    const request = (): superTest.SuperTest<superTest.Test> => superTest(app.getHttpServer());

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication(
            undefined,
            getAppOptions(),
        );
        await app.init();
    });

    afterAll(() => app.close());

    describe('GET /meta/fail', () => {
        it('returns 500 INTERNAL SERVER ERROR', async () => {
            await request()
                .get('/meta/fail')
                .set('X-Correlation-Id', 'GET /meta/fail test')
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    describe('POST /meta/echo', () => {

        describe('a valid POST', () => {
            it('returns 201 CREATED', async () => {
                const value = 'Pete';
                const res = await request()
                    .post('/meta/echo')
                    .set('X-Correlation-Id', 'POST /meta/echo success case')
                    .send({ value })
                    .expect(HttpStatus.CREATED);
                expect(res.body).toEqual({ pong: true, text: value });
            });
        });

        describe('an invalid POST that times out', () => {
            it('returns 400 BAD REQUEST', async () => {
                const value = 'Pete';
                const data = { value };
                const req = request()
                    .post('/meta/echo')
                    // Force it to expect an extra byte
                    .set('Content-Length', (JSON.stringify(data).length + 1).toString())
                    .set('X-Correlation-Id', 'POST /meta/echo failure case')
                    .send(data);
                await new Promise(resolve => setTimeout(resolve, 100));
                req.abort();
                req.end();
                const res = await req;
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
    });
});
