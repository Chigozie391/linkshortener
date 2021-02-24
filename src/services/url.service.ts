import HttpException from '../exceptions/HttpException';
import { URLAttributes } from '../interfaces/url.interfaces';
import urlModel from '../models/url.model';
import { createHash } from 'crypto';

class URLService {
  public url = urlModel;

  public async getAllURL(): Promise<URLAttributes[]> {
    const urls: URLAttributes[] = await this.url.findAll({ where: { deletedFlag: false } });
    return urls;
  }

  public async getURLByShortKey(shortKey: string): Promise<string> {
    const url: URLAttributes = await this.url.findOne({ where: { shortKey }, attributes: ['originalUrl'] });
    if (!url) return '/';

    return url.originalUrl;
  }

  public async shortenURL(originalUrl: string): Promise<string> {
    let shortKey = this.hash(originalUrl);
    const key: URLAttributes = await this.url.findOne({ where: { shortKey: shortKey, deletedFlag: false } });

    if (key) {
      shortKey = this.hash(originalUrl, shortKey.length + 1);
      const url: URLAttributes = await this.url.findOne({ where: { shortKey: shortKey, deletedFlag: false } });
      if (url) throw new HttpException(409, `A matching url found with ${url.shortKey}`);
    }

    const urlCreated: URLAttributes = await this.url.create({ shortKey, originalUrl });

    return urlCreated.shortKey;
  }

  public async deleteShortKey(shortKey: string): Promise<[number, URLAttributes[]]> {
    const deletedKey = await this.url.findOne({ where: { shortKey, deletedFlag: true }, paranoid: false });
    if (deletedKey) throw new HttpException(409, 'Short key does not exist');

    const deleteUser = await this.url.update({ deletedFlag: true, deletedAt: new Date() }, { where: { shortKey } });
    if (!deleteUser) throw new HttpException(409, 'SHort key does not exist');

    return deleteUser;
  }

  private hash(longUrl: string, length: number = 4): string {
    const start = Math.random() * 10;
    const sha = createHash('sha256');
    sha.update(longUrl);

    return sha.digest('base64').replace('/', '+').substr(parseInt(start.toFixed()), length);
  }
}

export default URLService;
