// /models/address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    address_id: { type: Number, required: true, unique: true },
    customer_id: Number,
    address1: String,
    address2: String,
    city: String,
    company: String,
    country_code: String,
    first_name: String,
    last_name: String,
    phone: String,
    zip: String,
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
}, { timestamps: true });

const Address = mongoose.models.address || mongoose.model('address', addressSchema);
export default Address;
