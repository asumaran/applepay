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
  if (!ApplePaySession) {
    return;
  }

  addToCart().then(function(newRequest) {
    setTimeout(function() {
      const session = new ApplePaySession(3, newRequest);
      session.onvalidatemerchant = async event => {
        // Call your own server to request a new merchant session.
        const merchantSession = await validateMerchant();
        console.log('merchantSession –>', merchantSession);
        session.completeMerchantValidation(merchantSession);
      };
      session.onpaymentauthorized = event => {
        console.log('success –>', event);
        // Define ApplePayPaymentAuthorizationResult
        const result = {
          "status": ApplePaySession.STATUS_SUCCESS
        };
        session.completePayment(result);
      };

      session.oncancel = event => {
        // Payment cancelled by WebKit
      };

      session.begin();
    }, 0);
  });
}
