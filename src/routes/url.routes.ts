import { Router } from 'express';
import URLController from '../controllers/url.controller';
import { CreateURLDto } from '../dtos/url.dto';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

class URLRoute implements Route {
  public path = '/api/v1/url';
  public router = Router();
  public urlController = new URLController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // shoten urk
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateURLDto), this.urlController.createShortKey);

    // delete url
    this.router.delete(`${this.path}/:id`, authMiddleware, this.urlController.deleteShortKey);

    // get url by shorukey
    this.router.get(`/:id`, this.urlController.redirectToLongUrl);

    // Home
    this.router.get(`/`, this.urlController.redirectToHome);
  }
}

export default URLRoute;
