import * as Bunyan from 'bunyan';
import { Request } from 'express';
import * as os from 'os';

// we have to use env vars directly here as we instantiate this before
// the config service exists.

function generateDisplayedHostname() {
    if (process.env.NODE_ENV === 'local') {
        return `local.${os.hostname()}`;
    }

    const release = process.env.CONTAINER_VERSION ?? 'UNKNOWN';
    const base = os.hostname().split('.')[0] ?? 'missing-hostname';

    return `${process.env.NODE_ENV}.${release}.${base}`;
}

export const ROOT_LOGGER = Bunyan.createLogger({
    name: 'data-api-v2',
    hostname: generateDisplayedHostname(),
    level: (process.env.DAPIV2_LOG_LEVEL || 'INFO') as Bunyan.LogLevel,
});

export function decorateRequestLogger(logger: Bunyan, request: Request) {
    const ret: { [key: string]: any } = {};
    if (!request || !request.params) {
        // this shouldn't ever happen, but also shouldn't break if it does, so let's just warn.
        logger.warn('decorateRequestLogger: No request or request params received?');
        return {};
    }
    ret.rowerId = request.params.rowerId ? parseInt(request.params.rowerId, 10) : undefined;
    ret.workoutId = request.params.workoutId ? parseInt(request.params.workoutId, 10) : undefined;
    return ret;
}
