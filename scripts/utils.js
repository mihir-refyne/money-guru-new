const https = require("https");

function requestGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let responseData = "";

      res.on("data", function (chunk) {
        responseData += chunk;
      });

      res.on("end", function () {
        req.end();
        resolve({
          headers: res.headers,
          statusCode: res.statusCode,
          body: responseData,
        });
      });

      res.on("error", function () {
        reject("Failed to fetch");
      });
    });
  });
}

function toJSON(value) {
  if (!value) throw new Error("Falsy value provided");
  return JSON.parse(value);
}

module.exports = { requestGet, toJSON };
