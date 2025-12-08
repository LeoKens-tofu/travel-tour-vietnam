const router = require('express').Router();
const orderController = require('../../controllers/client/order.controller')

router.post('/create', orderController.createPost)

router.get('/success', orderController.successGet);

router.get('/payment-zalopay', orderController.paymentZaloPay);

router.post('/payment-zalopay-result', orderController.paymentZaloPayResult);

router.get('/payment-vnpay', orderController.paymentVNPay);

router.get('/payment-vnpay-result', orderController.paymentVNPayResult);


module.exports = router