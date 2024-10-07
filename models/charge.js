// /models/charge.js
import mongoose from 'mongoose';
const { Decimal128 } = mongoose.Schema.Types;

const utmParamsSchema = new mongoose.Schema({
    utm_campaign: String,
    utm_content: String,
    utm_data_source: String,
    utm_medium: String,
    utm_source: String,
    utm_term: String,
    utm_time_stamp: Date
});

const analyticsDataSchema = new mongoose.Schema({
    utm_params: [utmParamsSchema]
});

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

const clientDetailsSchema = new mongoose.Schema({
    browser_ip: String,
    user_agent: String
});

const customerSchema = new mongoose.Schema({
    id: Number,
    email: String,
    external_customer_id: {
        ecommerce: String
    },
    hash: String
});

const discountSchema = new mongoose.Schema({
    id: Number,
    code: String,
    value: Number,
    value_type: String
});

const externalOrderIdSchema = new mongoose.Schema({
    ecommerce: String
});

const externalTransactionIdSchema = new mongoose.Schema({
    payment_processor: String
});

const propertiesSchema = new mongoose.Schema({
    name: String,
    value: String
});

const taxLinesSchema = new mongoose.Schema({
    price: String,
    rate: Number,
    title: String
});

const lineItemsSchema = new mongoose.Schema({
    purchase_item_id: Number,
    external_product_id: {
        ecommerce: String
    },
    external_variant_id: {
        ecommerce: String
    },
    grams: Number,
    images: {
        large: String,
        medium: String,
        original: String,
        small: String
    },
    original_price: String,
    properties: [propertiesSchema],
    purchase_item_type: String,
    quantity: Number,
    sku: String,
    tax_due: String,
    tax_lines: [taxLinesSchema],
    taxable: Boolean,
    taxable_amount: String,
    title: String,
    total_price: String,
    unit_price: String,
    variant_title: String
});

const orderAttributesSchema = new mongoose.Schema({
    name: String,
    value: String
});

const shippingLinesSchema = new mongoose.Schema({
    code: String,
    price: String,
    title: String
});

const chargeSchema = new mongoose.Schema({
    charge_id: { type: Number, required: true, unique: true },
    address_id: Number,
    analytics_data: analyticsDataSchema,
    billing_address: billingAddressSchema,
    client_details: clientDetailsSchema,
    created_at: { type: Date, required: true },
    currency: String,
    customer: customerSchema,
    discounts: [discountSchema],
    error: { type: String, default: null },
    error_type: { type: String, default: null },
    external_order_id: externalOrderIdSchema,
    external_transaction_id: externalTransactionIdSchema,
    has_uncommitted_changes: { type: Boolean, default: false },
    line_items: [lineItemsSchema],
    note: String,
    order_attributes: [orderAttributesSchema],
    processor_name: String,
    scheduled_at: Date,
    shipping_address: billingAddressSchema,
    shipping_lines: [shippingLinesSchema],
    status: String,
    subtotal_price: String,
    tags: String,
    tax_lines: [taxLinesSchema],
    taxes_included: { type: Boolean, default: true },
    total_discounts: String,
    total_line_items_price: String,
    total_price: String,
    total_refunds: { type: String, default: null },
    total_tax: String,
    total_weight_grams: Number,
    type: String,
    updated_at: { type: Date, required: true },
    subscription_products_total: { type: Decimal128, default: "0.00" }
}, { timestamps: true });

const Charge = mongoose.models.charge || mongoose.model('charge', chargeSchema);
export default Charge;
