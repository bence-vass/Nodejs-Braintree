const express = require('express');
const router = express.Router();
const braintree = require('braintree');


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.merchantId,
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey
})

router.post('/pay', (req, res, next) => {
    const nonceFromTheClient = req.body.payload.nonce;
    gateway.transaction.sale({
        amount: '110.00',
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }).then((result, error) => {
        if (result) {
            res.status(201).send(result);
        }
        if(error){
            res.status(501).send(error);
        }
    });
});


router.get('/', async (req, res, next) => {
    const clientTokenFromServer = await gateway.clientToken.generate({})
    res.render('checkout/index', {clientToken: clientTokenFromServer.clientToken})
})



module.exports = router;