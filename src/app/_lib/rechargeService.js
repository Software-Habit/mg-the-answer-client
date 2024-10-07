// /app/_lib/rechargeService.js
const rechargeBaseUrl = 'https://api.rechargeapps.com';

class LeakyBucketRateLimiter {
    constructor(maxBucketSize, leakRatePerSecond, interval = 1000) {
        this.maxBucketSize = maxBucketSize;
        this.leakRatePerSecond = leakRatePerSecond;
        this.interval = interval;
        this.currentBucketSize = 0;
        this.queue = [];
        this.timer = setInterval(() => this.leak(), this.interval);
    }

    enqueue(requestFunc) {
        if (this.currentBucketSize < this.maxBucketSize) {
            this.currentBucketSize++;
            return new Promise((resolve, reject) => {
                requestFunc().then(resolve).catch(reject).finally(() => {
                    this.currentBucketSize--;
                    this.processQueue();
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                this.queue.push({ requestFunc, resolve, reject });
            });
        }
    }

    processQueue() {
        while (this.currentBucketSize < this.maxBucketSize && this.queue.length > 0) {
            const { requestFunc, resolve, reject } = this.queue.shift();
            this.enqueue(requestFunc).then(resolve).catch(reject);
        }
    }

    leak() {
        const actualLeakAmount = Math.min(this.leakRatePerSecond, this.currentBucketSize);
        this.currentBucketSize = Math.max(0, this.currentBucketSize - actualLeakAmount);
        this.processQueue();
    }
}

const rateLimiter = new LeakyBucketRateLimiter(40, 2);

// Helper function for API calls
async function fetchFromRecharge(url) {
    try {
        return await rateLimiter.enqueue(() =>
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RECHARGE_API_TOKEN}`,
                    'X-Recharge-Version': '2021-11'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                return response.json();
            })
        );
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
        throw error;
    }
}

// Fetch Subscriptions
export async function fetchSubscriptions(limit = 250, page = 1, updated_at_min = null) {
    let url = `${rechargeBaseUrl}/subscriptions?limit=${limit}&page=${page}`;
    if (updated_at_min) {
        url += `&updated_at_min=${updated_at_min}`;
    }
    const data = await fetchFromRecharge(url);
    return data.subscriptions || [];
}

// Fetch Charges
export async function fetchCharges(limit = 250, page = 1, updated_at_min = null) {
    let url = `${rechargeBaseUrl}/charges?limit=${limit}&page=${page}`;
    if (updated_at_min) {
        url += `&updated_at_min=${updated_at_min}`;
    }
    const data = await fetchFromRecharge(url);
    return data.charges || [];
}

// Fetch Orders
export async function fetchOrders(limit = 250, page = 1, updated_at_min = null) {
    let url = `${rechargeBaseUrl}/orders?limit=${limit}&page=${page}`;
    if (updated_at_min) {
        url += `&updated_at_min=${updated_at_min}`;
    }
    const data = await fetchFromRecharge(url);
    return data.orders || [];
}

// Fetch Customers
export async function fetchCustomers(limit = 250, page = 1, updated_at_min = null) {
    let url = `${rechargeBaseUrl}/customers?limit=${limit}&page=${page}`;
    if (updated_at_min) {
        url += `&updated_at_min=${updated_at_min}`;
    }
    const data = await fetchFromRecharge(url);
    return data.customers || [];
}

// Fetch Addresses
export async function fetchAddresses(limit = 250, page = 1, updated_at_min = null) {
    let url = `${rechargeBaseUrl}/addresses?limit=${limit}&page=${page}`;
    if (updated_at_min) {
        url += `&updated_at_min=${updated_at_min}`;
    }
    const data = await fetchFromRecharge(url);
    return data.addresses || [];
}
