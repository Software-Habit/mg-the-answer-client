// /models/subscription.js
import mongoose from 'mongoose';

const propertiesSchema = new mongoose.Schema({
    name: { type: String },
    value: { type: String }
});

const analyticsDataSchema = new mongoose.Schema({
    utm_params: [{ type: String }]
});

const subscriptionSchema = new mongoose.Schema({
    subscription_id: { type: Number, required: true, unique: true }, // Storing ReCharge "id" as "subscription_id"
    address_id: { type: Number, required: true },
    analytics_data: analyticsDataSchema,
    cancellation_reason: { type: String, default: null },
    cancellation_reason_comments: { type: String, default: null },
    cancelled_at: { type: Date, default: null },
    charge_interval_frequency: { type: String, required: true },
    created_at: { type: Date, required: true },
    customer_id: { type: Number, required: true },
    email: { type: String, required: true },
    expire_after_specific_number_of_charges: { type: Number, default: null },
    has_queued_charges: { type: Boolean, required: true },
    is_prepaid: { type: Boolean, required: true },
    is_skippable: { type: Boolean, required: true },
    is_swappable: { type: Boolean, required: true },
    max_retries_reached: { type: Number, required: true },
    next_charge_scheduled_at: { type: Date, required: true },
    order_day_of_month: { type: Number, default: null },
    order_day_of_week: { type: Number, default: null },
    order_interval_frequency: { type: String, required: true },
    order_interval_unit: { type: String, required: true },
    presentment_currency: { type: String, required: true },
    price: { type: Number, required: true },
    product_title: { type: String, required: true },
    properties: [propertiesSchema],
    quantity: { type: Number, required: true },
    recharge_product_id: { type: Number, required: true },
    shopify_product_id: { type: Number, required: true },
    shopify_variant_id: { type: Number, required: true },
    sku: { type: String, required: true },
    sku_override: { type: Boolean, required: true },
    status: { type: String, required: true },
    updated_at: { type: Date, required: true },
    variant_title: { type: String, required: true }
}, { timestamps: true });

const Subscription = mongoose.models.subscription || mongoose.model('subscription', subscriptionSchema);
export default Subscription;
