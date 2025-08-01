const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controllers/stripeController');

// Route to create payment intent
router.post('/create-payment-intent', createPaymentIntent);

router.post('/webhook', handleWebhook);


module.exports = router;
