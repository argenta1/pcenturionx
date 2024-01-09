const stripe = require('stripe')('sk_test_51NTW1eKaYo8qfr6meUNJ0zbwppv5QiU3iMmhGAA3ZLH76jY2CzVOd0PVGDG4w1vG4UlUkzMEPgO3bG6Rx7SS42g400nhZWBBKs');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { amount } = req.body;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Purchase Followers',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'http://127.0.0.1:5500/payment-success.html',
                cancel_url: 'http://127.0.0.1:5500/payment-failed.html',
            });

            res.status(200).json({ sessionId: session.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};
