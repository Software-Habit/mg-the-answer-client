// /models/order.js
import mongoose from 'mongoose';

const billingAddressSchema = new mongoose.Schema({
    address1: String,
    address2: String,
    city: String,
    company: String,
    country_code: String,
    first_name: String,
    last_name: String,
    phone: String,
    province: String,
    zip: String
});

const lineItemsSchema = new mongoose.Schema({
    purchase_item_id: Number,
    title: String,
    quantity: Number,
    unit_price: String
});

const orderSchema = new mongoose.Schema({
    order_id: { type: Number, required: true, unique: true },
    address_id: Number,
    billing_address: billingAddressSchema,
    client_details: {
        browser_ip: String,
        user_agent: String
    },
    created_at: { type: Date, required: true },
    currency: String,
    customer: {
        id: Number,
        email: String,
        external_customer_id: {
            ecommerce: String
        },
        hash: String
    },
    line_items: [lineItemsSchema],
    shipping_address: billingAddressSchema,
    status: String,
    total_price: String,
    total_tax: String,
    updated_at: { type: Date, required: true }
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;
