const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
    const { amount, customerId } = req.body;

    try {
        if (!amount || amount <= 0) {
            console.error('Invalid amount provided:', amount);
            return res.status(400).json({ message: 'Invalid amount' });
        }

        console.log('Creating payment intent with amount:', amount, 'customerId:', customerId);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paisa for NPR
            currency: 'npr',
            metadata: { customerId: customerId || 'unknown' },
        });

        console.log('Payment intent created:', paymentIntent.id);
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe createPaymentIntent error:', error.message, error.stack);
        res.status(500).json({ message: `Failed to create payment intent: ${error.message}` });
    }
};

// Webhook handler to update order status after payment
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('Webhook event received:', event.type);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message, err.stack);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        // Order is created in StripeForm, so no orderId in metadata
        // Optionally log or handle additional metadata if needed
    }

    res.json({ received: true });
};