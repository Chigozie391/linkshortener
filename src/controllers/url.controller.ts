import { NextFunction, Request, Response } from 'express';
import { CreateURLDto } from '../dtos/url.dto';
import { URLAttributes } from '../interfaces/url.interfaces';
import URLService from '../services/url.service';

class URLController {
  private urlService = new URLService();

  public redirectToLongUrl = async (req: Request, res: Response, next: NextFunction) => {
    const shortKey: string = req.params.id;

    try {
      const originalUrl: string = await this.urlService.getURLByShortKey(shortKey);
      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  };

  public redirectToHome = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send(`Homepage`);
    } catch (error) {
      next(error);
    }
  };

  public createShortKey = async (req: Request, res: Response, next: NextFunction) => {
    const urlDto: CreateURLDto = req.body;

    try {
      const shortKey: string = await this.urlService.shortenURL(urlDto.originalUrl);
      res.status(201).json({ message: 'success', data: { url: `${process.env.HOST}${shortKey}` } });
    } catch (error) {
      next(error);
    }
  };

  public deleteShortKey = async (req: Request, res: Response, next: NextFunction) => {
    const shortKey: string = req.params.id;

    try {
      const urlData: [number, URLAttributes[]] = await this.urlService.deleteShortKey(shortKey);
      res.status(200).json({ data: { deleted: urlData[0] }, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default URLController;
