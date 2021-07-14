const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public', {
  dotfiles: 'allow'
}));

// GET method route
app.get('/validateMerchant', function(req, res) {
  const httpsAgent = new https.Agent({
    key: fs.readFileSync('nuevo.key.pem'),
    cert: fs.readFileSync('nuevo.crt.pem'),
    rejectUnauthorized: false
  });

  const options = {
    merchantIdentifier: "merchant.prueba",
    displayName: "Prueba",
    initiative: "web",
    initiativeContext: "3dde392fbed1.ngrok.io"
  };
  fetch('https://apple-pay-gateway-cert.apple.com/paymentservices/startSession', {
      method: 'POST',
      body: JSON.stringify(options),
      agent: httpsAgent
    })
    .then(function(response) {
      return response.json();
    }).then(function(response) {
      console.log('response1 –>', response);
      res.send(response);
    });
});

app.get('/addToCart', function(req, res) {
  const shippingFields = [
    "postalAddress",
    "name",
    "phone",
    "email"
  ];
  const request = {
    "countryCode": "US",
    "currencyCode": "USD",
    "merchantCapabilities": [
      "supports3DS",
    ],
    "supportedNetworks": [
      "visa"
    ],
    "requiredShippingContactFields": Math.random() < 0.5 ? shippingFields : undefined,
    "lineItems": [{
      "label": "Sales Tax",
      "amount": "0.00"
    }],
    "total": {
      "label": "Demo (Card is not charged)",
      "amount": "1.99",
      "type": "final"
    }
  };

  res.send(request);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});