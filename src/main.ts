import { buildMainApp } from './init';

async function bootstrap() {
    const application = await buildMainApp();

    await application.listen(3000);
}

bootstrap().catch((error) => {
    throw error;
});
