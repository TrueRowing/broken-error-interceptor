import * as http from 'http';
import { HttpStatus } from '@nestjs/common';

describe('Meta controller', () => {

    describe('POST /meta/fail', () => {
        it('returns 500 INTERNAL SERVER ERROR', done => {
            const data = JSON.stringify({value: 'Pete'});
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/meta/fail',
                method: 'GET',
            }
            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`);
                res.on('data', d => {
                    process.stdout.write(d);
                });
                res.on('end', () => {
                    expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
                    done();
                });
            });
            req.on('error', err => {
                done(new Error('Hmm... how did this happen?'));
            });
            req.end();
        });
    });

    describe('POST /meta/echo', () => {

        describe('a valid POST', () => {
            it('returns 201 CREATED', done => {
                const data = JSON.stringify({ value: 'Pete' });
                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/meta/echo',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.length,
                    },
                }
                const req = http.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`);
                    res.on('data', d => {
                        process.stdout.write(d);
                    });
                    res.on('end', () => {
                        expect(res.statusCode).toBe(HttpStatus.CREATED);
                        done();
                    });
                });
                req.on('error', err => {
                    done(err);
                });
                req.write(data);
                req.end();
            });
        });

        describe('an invalid POST that times out', () => {
            it('returns 400 BAD REQUEST', done => {
                const data = JSON.stringify({ value: 'Pete' });
                const options = {
                    hostname: 'localhost',
                    port: 3000,
                    path: '/meta/echo',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Force it to expect an extra byte
                        'Content-Length': data.length + 1,
                    },
                }
                const req = http.request(options, res => {
                    console.log(`statusCode: ${res.statusCode}`);
                    res.on('data', d => {
                        process.stdout.write(d);
                    });
                    res.on('end', () => {
                        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
                        done();
                    });
                });
                req.on('error', err => {
                    done(err);
                });
                req.write(data);
                setTimeout(() => {
                    req.abort();
                    req.end();
                }, 100);
            });
        });
    });
});
