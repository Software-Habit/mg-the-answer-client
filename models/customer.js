// /models/customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    customer_id: { type: Number, required: true, unique: true },
    email: String,
    first_name: String,
    last_name: String,
    phone: String,
    subscriptions_active_count: Number,
    subscriptions_total_count: Number,
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
}, { timestamps: true });

const Customer = mongoose.models.customer || mongoose.model('customer', customerSchema);
export default Customer;
