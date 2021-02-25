import * as request from 'supertest';
import App from '../app';
import URLRoute from '../routes/url.routes';
import URL from '../models/url.model';

const data = {
  originalUrl: 'https://www.examplesofgreatposts.com/2021/02'
};

let shortKey = '';

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve({}), 100));
  await URL.destroy({ where: { originalUrl: data.originalUrl }, force: true });
});

describe('Link Shortener tests', () => {
  it('Should return 404 for undefine routes', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).get(`/undefinedroutes/undefined`);
    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('message');
  });

  it('Should return 200 OK status for homepage', () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    return request(app.getServer()).get(`/`).expect(200);
  });

  it('Should return unauthorized if secret_key is not present', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).post(`${indexRoute.path}`).send(data);
    expect(res.status).toEqual(401);
    expect(res.body).toMatchObject({ message: 'Unauthorized: Missing secret_key' });
  });

  it('Should return unauthorized if secret_key is incorrect', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).post(`${indexRoute.path}`).send(data).set('secret_key', 'SHKDDJJJDKKDLDHJL');

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });

  it('Should return validation error if DTO criterias is not met', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer())
      .post(`${indexRoute.path}`)
      .send({ originalUrl: 'facebook' })
      .set('secret_key', process.env.API_KEY);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Should succesfully create short url', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).post(`${indexRoute.path}`).send(data).set('secret_key', process.env.API_KEY);
    shortKey = res.body.data.url.split(process.env.HOST)[1];

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('data.url');
  });

  it('Should successfully redirect to long url', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).get(`/${shortKey}`);
    expect(res.status).toEqual(302);
  });

  it('Should succesfully delete short url', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).delete(`${indexRoute.path}/${shortKey}`).set('secret_key', process.env.API_KEY);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });

  it('Should fail to delete short url if already deleted', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);

    const res = await request(app.getServer()).delete(`${indexRoute.path}/${shortKey}`).set('secret_key', process.env.API_KEY);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Should redirect to homepage if shorkey is not found', async () => {
    const indexRoute = new URLRoute();
    const app = new App([indexRoute]);
    const fakeShortKey = '1234';
    const res = await request(app.getServer()).get(`/${fakeShortKey}`);
    expect(res.status).toEqual(302);
    expect(res.text).toContain('Found. Redirecting to /');
  });
});
