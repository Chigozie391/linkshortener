import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as logger from 'morgan';
import * as swaggerJsDocs from 'swagger-jsdoc';
import * as swaggerUI from 'swagger-ui-express';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import { sequelize } from './models/index.model';

class App {
  public app: express.Application;
  public port: string | number;
  public env: boolean;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: process.env.DOMAIN, credentials: true }));
    } else {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }
    sequelize.sync({ force: false });
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    const swaggerDocs = swaggerJsDocs(this.getSwaggerOptions());
    this.app.use('/api/v1/docs', swaggerUI.serve);
    this.app.get('/api/v1/docs', swaggerUI.setup(swaggerDocs));
    routes.forEach(route => {
      this.app.use('/', route.router);
    });

    this.app.all('*', (req, res) => {
      return res.status(404).json({ status: 404, message: `Can not ${req.method} ${req.path}`, data: null });
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private getSwaggerOptions(): swaggerJsDocs.Options {
    return {
      swaggerDefinition: {
        openapi: '3.0.0',
        host: process.env.HOST,
        info: {
          title: 'Link Shortener',
          description: 'Link Shortener API',
          version: '1.0.0',
          contact: {
            name: 'Chigozie Madubuko',
            email: 'chigoziemadubuko@gmail.com'
          }
        }
      },
      apis: ['./documentation.yaml']
    };
  }
}

export default App;
