/* eslint-disable max-len */
/* eslint-disable padding-line-between-statements */
const http = require('http');
const { convertToCase } = require('./convertToCase');
const createServer = () => {
  return http.createServer((req, res) => {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`);

    const originalText = url.pathname.slice(1);
    const targetCase = url.searchParams.get('toCase');

    if (!originalText) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          errors: [
            {
              message:
                'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>"',
            },
          ],
        }),
      );
      return;
    }

    if (!targetCase) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          errors: [
            {
              message:
                '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>"',
            },
          ],
        }),
      );
      return;
    }

    if (!['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'].includes(targetCase)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          errors: [
            {
              message: `This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.`,
            },
          ],
        }),
      );
      return;
    }

    const { originalCase, convertedText } = convertToCase(
      originalText,
      targetCase,
    );

    const responseBody = {
      originalCase: originalCase,
      targetCase: targetCase,
      originalText: originalText,
      convertedText: convertedText,
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseBody));
  });
};

module.exports = {
  createServer,
};
