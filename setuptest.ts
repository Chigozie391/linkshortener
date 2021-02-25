import * as dotenv from 'dotenv';
dotenv.config({ path: '.test.env' });
console.log(process.env.MYSQL_PATH);
