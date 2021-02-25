import HttpException from '../exceptions/HttpException';
import { URLAttributes } from '../interfaces/url.interfaces';
import urlModel from '../models/url.model';
import { createHash } from 'crypto';

class URLService {
  public url = urlModel;

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
    if (deletedKey) throw new HttpException(400, 'Short key does not exist');

    const deleteUser = await this.url.update({ deletedFlag: true, deletedAt: new Date() }, { where: { shortKey } });
    if (!deleteUser) throw new HttpException(400, 'SHort key does not exist');

    return deleteUser;
  }

  private hash(longUrl: string, length: number = 4): string {
    const sha = createHash('sha256');
    sha.update(longUrl);

    const chars = sha.digest('base64').replace('/', '+');
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}

export default URLService;
