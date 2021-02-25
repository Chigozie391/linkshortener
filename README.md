# [Link Shortener API](https://iqx.herokuapp.com/api/v1/docs/)

This is a simple link shortener API that takes a long URL and returns the equivalent short URL

## Configuration

* Run the following command to install all dependencies

```bash
npm install
```

* Configure Database credentials

```env
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_PATH=localhost
MYSQL_DATABASE=shortener
HOST=http://localhost/
DOMAIN=localhost
PORT=80
NODE_ENV=development

```

* Start locally by running

```npm
npm run dev
```


* To run all test cases
```bash
npm test
```

* To build
```npm
npm build
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
