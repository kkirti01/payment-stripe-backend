const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("sk_test_51J9VuJSDQpXJGM5BpSwljh0gUDqdepQCIWvTwYAL5uXneuiTI9cOeXn4PBLb5RYjtdTURvqNQu5FW2Gtiv10UsvV00t1DFPQQ9");
// const uuid = require("uuid").v4();
// const { v4: uuidv4 } = require('uuid');
// uuidv4();
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const app = express();



// middleware
app.use(express.json());
app.use(cors());




// routes
app.get("/", (req, res) => {
    res.send("It works at blemacion");
});

app.post("/payment", (req, res) => {

    const { product, token } = req.body;
    console.log("product", product);
    console.log("price", product.price);
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of product.name`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempotencyKey });
    })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))

});


// listen

app.listen(8282, () => console.log("Listening at Port 8282"));