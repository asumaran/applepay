function onPayClick() {
   if (window.ApplePaySession) {
      if (ApplePaySession.canMakePayments()) {
         var request = {
           countryCode: 'US',
           currencyCode: 'USD',
           supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
           merchantCapabilities: ['supports3DS'],
           total: { label: 'Your Merchant Name', amount: '10.00' },
         };

         let session = new ApplePaySession(3, request);

         setTimeout(() => {
            request.total = { label: 'Your Another Merchant Name', amount: '20.00' };
            
            session = new ApplePaySession(3, request);

            session.begin();
         }, 1000)
      }
   }
}

const pay = document.querySelector('#pay');

pay.addEventListener('click', onPayClick);