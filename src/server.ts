import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import URLRoute from './routes/url.routes';

validateEnv();

const app = new App([new URLRoute()]);

app.listen();
