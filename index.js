import { createServer } from 'http';
import { readFile, readFileSync } from 'fs';
import url from 'url';
import replaceTemplate from './modules/replace-template.js';
import slugify from 'slugify';
const PORT = 8000;
const localhost = '127.0.0.1';

const tempCard = readFileSync(`${import.meta.dirname}/templates/template-card.html`, 'utf8');
const tempOverview = readFileSync(`${import.meta.dirname}/templates/template-overview.html`, 'utf8');
const tempProduct = readFileSync(`${import.meta.dirname}/templates/template-product.html`, 'utf8');

const data = readFileSync(`${import.meta.dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello world!',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(PORT, localhost, () => {
  console.log(`Listening to requests on port:  ${PORT}:${localhost}`);
});
