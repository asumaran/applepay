const pay = document.querySelector('#test');

function validateMerchant() {
  return fetch("/validateMerchant").then(function(response) {
    return response.json();
  }).then(function(response) {
    return response;
  });
}

function addToCart() {
  return fetch("/addToCart").then(function(response) {
    return response.json();
  }).then(function(response) {
    return response;
  })
}

function onApplePayButtonClicked() {
  const t0 = performance.now();

  if (!ApplePaySession) {
    return;
  }

  const request = {
    "countryCode": "US",
    "currencyCode": "USD",
    "merchantCapabilities": [
      "supports3DS",
    ],
    "supportedNetworks": [
      "visa"
    ],
    "total": {
      "label": "Demo (Card is not charged)",
      "amount": "1.99",
      "type": "final"
    }
  };

  setTimeout(function() {
    const session = new ApplePaySession(3, request);

    session.onvalidatemerchant = async event => {
      const merchantSession = await validateMerchant();
      session.completeMerchantValidation(merchantSession);
    };

    session.onpaymentauthorized = event => {
      console.log('onpaymentauthorized –>', event);
      const result = {
        "status": ApplePaySession.STATUS_SUCCESS
      };
      session.completePayment(result);
    };

    session.begin();
    const t1 = performance.now();
    console.log(`1 took ${t1 - t0} milliseconds.`);
  }, 999);
}


function onApplePayButtonClicked2() {
    const t0 = performance.now();

    // Consider falling back to Apple Pay JS if Payment Request is not available.
    if (!PaymentRequest) {
        return;
    }

    try {
        // Define PaymentMethodData
        const paymentMethodData = [{
            "supportedMethods": "https://apple.com/apple-pay",
            "data": {
                "version": 3,
                "merchantIdentifier": "merchant.com.example",
                "merchantCapabilities": [
                    "supports3DS"
                ],
                "supportedNetworks": [
                    "amex",
                    "discover",
                    "masterCard",
                    "visa"
                ],
                "countryCode": "US"
            }
        }];
        // Define PaymentDetails
        const paymentDetails = {
            "total": {
                "label": "My Merchant",
                "amount": {
                    "value": "27.50",
                    "currency": "USD"
                }
            }
        };
        // Define PaymentOptions
        const paymentOptions = {
            "requestPayerName": false,
            "requestBillingAddress": false,
            "requestPayerEmail": false,
            "requestPayerPhone": false,
            "requestShipping": true,
            "shippingType": "shipping"
        };
        
        // Create PaymentRequest
        const request = new PaymentRequest(paymentMethodData, paymentDetails, paymentOptions);
        console.log('request –>',request);
        request.onmerchantvalidation = async (event) => {
            // Call your own server to request a new merchant session.
            const merchantSessionPromise = await validateMerchant();
            console.log('merchantSessionPromise –>',merchantSessionPromise);
            event.complete(merchantSessionPromise);
        };
    
        request.onshippingaddresschange = event => {
            // Define PaymentDetailsUpdate based on a shipping address change.
            const paymentDetailsUpdate = {
                "total": {
                    "label": "My Merchant",
                    "amount": {
                        "value": "27.50",
                        "currency": "USD"
                    }
                }
            };
            event.updateWith(paymentDetailsUpdate);
        };

        setTimeout(async function () {
          const t1 = performance.now();
          console.log(`1 took ${t1 - t0} milliseconds.`);
          const response = await request.show();
          const status = "success";
          await response.complete(status);
        }, 999);

    } catch (e) {
      console.error(e);
    }
}
