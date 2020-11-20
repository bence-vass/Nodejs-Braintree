const Payment = require('../models/Payment')
const braintree = require('braintree');
const Order = require('../models/Order')

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.merchantId,
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey
})

exports.startPayment = async (req, res, next) => {
    try{
        const clientTokenResponse = await gateway.clientToken.generate({})
        let payment = new Payment({
            userID: 'user1',
            orderID: '5fb54f941e6f983bcca7cee4',
            gateway: 'braintree',
            clientToken: clientTokenResponse.clientToken,
            status: "INITIALIZE"
        })
        try{
            let response = await payment.save()
            res.status(200).json({status: 'success', clientToken: clientTokenResponse.clientToken})
        } catch (dbError) {
            res.status(200).json({status: 'error', response: dbError})
        }
    } catch (tokenError) {
        res.status(200).json({status: 'error', response: tokenError})
    }

}

exports.singleUsePayment = async (req, res, next) => {
    const nonce = req.body.payload.nonce;
    const orderID = req.body.orderId
    try{
        let order = await Order.findById(orderID)
        console.log(order)
        try{
            let sale = await gateway.transaction.sale({
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                }
            })
            console.log(sale)
            try{
                let payment = new Payment({
                    userID: 'user1',
                    orderID: '5fb54f941e6f983bcca7cee4',
                    gateway: 'braintree',
                    clientToken: nonce,
                    status: "AUTHORIZE_AND_CAPTURE"
                })
                let response = await payment.save()
                res.status(200).json({status: 'success', response: response})
            } catch (dbError) {
                res.status(200).json({status: 'error', response: dbError})
            }
        } catch (gatewayError) {
            res.status(200).json({status: 'error', response: gatewayError})
        }
    } catch (orderError) {
        res.status(200).json({status: 'error', response: orderError})
    }

   /* try{
        let sale = await gateway.transaction.sale({
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true,
            }
        })
        let payment = new Payment({
            userID: 'user1',
            orderID: '5fb54f941e6f983bcca7cee4',
            gateway: 'braintree',
            clientToken: clientTokenResponse.clientToken,
            status: "INITIALIZE"
        })
    } catch (paymentError) {
        res.status(200).json({status: 'error', response: paymentError})

    }*/



}

