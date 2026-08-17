// Flipkart Store Sales Mock Data Engine
// Simulates sales data for a top-tier Flipkart seller account over the past 365 days.

const CATEGORIES = {
    ELECTRONICS: 'Electronics',
    FASHION: 'Fashion',
    HOME_KITCHEN: 'Home & Kitchen',
    BEAUTY_PERSONAL_CARE: 'Beauty & Personal Care',
    GROCERY: 'Grocery'
};

const CHANNELS = {
    PLUS: 'Flipkart Plus',
    REGULAR: 'Regular Customer',
    QUICK_COMMERCE: 'Flipkart Minutes'
};

const STATES = [
    { name: 'Maharashtra', region: 'West' },
    { name: 'Karnataka', region: 'South' },
    { name: 'Delhi', region: 'North' },
    { name: 'Tamil Nadu', region: 'South' },
    { name: 'Uttar Pradesh', region: 'North' },
    { name: 'Telangana', region: 'South' },
    { name: 'West Bengal', region: 'East' },
    { name: 'Gujarat', region: 'West' },
    { name: 'Haryana', region: 'North' },
    { name: 'Kerala', region: 'South' }
];

const PAYMENT_METHODS = {
    UPI: 'UPI (PhonePe/GPay)',
    COD: 'Cash on Delivery',
    PAY_LATER: 'Flipkart Pay Later',
    CARD: 'Credit/Debit Card',
    NET_BANKING: 'Net Banking'
};

// Base products list
const BASE_PRODUCTS = [
    { id: 'PROD-101', name: 'Realme Narzo 60 Pro (12GB/256GB)', category: CATEGORIES.ELECTRONICS, price: 23999, stock: 120, rating: 4.3, minStock: 20 },
    { id: 'PROD-102', name: 'Boat Airdopes 131 Wireless Earbuds', category: CATEGORIES.ELECTRONICS, price: 999, stock: 15, rating: 4.1, minStock: 30 },
    { id: 'PROD-103', name: 'HP Victus Ryzen 5 Gaming Laptop', category: CATEGORIES.ELECTRONICS, price: 54990, stock: 45, rating: 4.4, minStock: 10 },
    { id: 'PROD-104', name: 'Mi Smart TV 4A 32-inch LED', category: CATEGORIES.ELECTRONICS, price: 12999, stock: 0, rating: 4.2, minStock: 15 },
    
    { id: 'PROD-201', name: 'Roadster Men Solid Cotton Henley T-Shirt', category: CATEGORIES.FASHION, price: 449, stock: 350, rating: 4.0, minStock: 50 },
    { id: 'PROD-202', name: 'Libas Women Floral Print Kurta Set', category: CATEGORIES.FASHION, price: 1299, stock: 180, rating: 4.3, minStock: 40 },
    { id: 'PROD-203', name: 'Puma Taper Solid Sneakers', category: CATEGORIES.FASHION, price: 2499, stock: 75, rating: 4.2, minStock: 25 },
    { id: 'PROD-204', name: 'Casio Vintage Digital Watch', category: CATEGORIES.FASHION, price: 1695, stock: 60, rating: 4.5, minStock: 15 },
    
    { id: 'PROD-301', name: 'Pigeon By Stovekraft 1.5L Kettle', category: CATEGORIES.HOME_KITCHEN, price: 699, stock: 240, rating: 4.2, minStock: 50 },
    { id: 'PROD-302', name: 'Milton Thermosteel Duo 1000ml Bottle', category: CATEGORIES.HOME_KITCHEN, price: 980, stock: 8, rating: 4.4, minStock: 30 },
    { id: 'PROD-303', name: 'Sleepwell Ortho Mattress (Queen Size)', category: CATEGORIES.HOME_KITCHEN, price: 14999, stock: 30, rating: 4.6, minStock: 5 },
    
    { id: 'PROD-401', name: 'Nivea Soft Moisturizer Cream 200ml', category: CATEGORIES.BEAUTY_PERSONAL_CARE, price: 299, stock: 500, rating: 4.4, minStock: 80 },
    { id: 'PROD-402', name: 'Loreal Paris Total Repair 5 Shampoo', category: CATEGORIES.BEAUTY_PERSONAL_CARE, price: 499, stock: 320, rating: 4.3, minStock: 60 },
    { id: 'PROD-403', name: 'Philips Selfie Hair Straightener', category: CATEGORIES.BEAUTY_PERSONAL_CARE, price: 899, stock: 95, rating: 4.1, minStock: 25 },
    
    { id: 'PROD-501', name: 'Tata Tea Premium 1kg Pack', category: CATEGORIES.GROCERY, price: 420, stock: 600, rating: 4.5, minStock: 100 },
    { id: 'PROD-502', name: 'Fortune Soya Health Oil 5L', category: CATEGORIES.GROCERY, price: 625, stock: 12, rating: 4.3, minStock: 50 },
    { id: 'PROD-503', name: 'Aashirvaad Shudh Chakki Atta 10kg', category: CATEGORIES.GROCERY, price: 460, stock: 450, rating: 4.6, minStock: 80 }
];

const MOCK_REVIEWS = [
    { user: 'Amit S.', rating: 5, comment: 'Amazing delivery speed! The laptop runs super smooth.', date: '2026-06-30', product: 'HP Victus Ryzen 5 Gaming Laptop' },
    { user: 'Priya K.', rating: 4, comment: 'Good quality kurta set. Color is slightly darker than the picture but fits perfectly.', date: '2026-06-30', product: 'Libas Women Floral Print Kurta Set' },
    { user: 'Rajesh M.', rating: 3, comment: 'Product is good but box was damaged during transit. Flipkart Plus delivery was quick though.', date: '2026-06-29', product: 'Milton Thermosteel Duo 1000ml Bottle' },
    { user: 'Sneha P.', rating: 5, comment: 'Excellent moisturizer for daily use. Highly recommended!', date: '2026-06-28', product: 'Nivea Soft Moisturizer Cream 200ml' },
    { user: 'Vikram R.', rating: 2, comment: 'The earbuds started disconnecting after 3 days. Initiated replacement.', date: '2026-06-27', product: 'Boat Airdopes 131 Wireless Earbuds' },
    { user: 'Anjali D.', rating: 5, comment: 'Tea tastes fresh and strong. Authentic Tata quality.', date: '2026-06-27', product: 'Tata Tea Premium 1kg Pack' },
    { user: 'Rohan G.', rating: 4, comment: 'Decent watch, looks elegant and vintage. Nice purchase.', date: '2026-06-26', product: 'Casio Vintage Digital Watch' },
    { user: 'Divya T.', rating: 5, comment: 'Best mattress ever. Back pain is almost gone in a week!', date: '2026-06-25', product: 'Sleepwell Ortho Mattress (Queen Size)' }
];

const MOCK_CUSTOMERS = [
    { id: 'CUST-1001', name: 'Aarav Mehta', email: 'aarav.mehta@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1002', name: 'Aditi Sharma', email: 'aditi.sharma@yahoo.com', tier: 'Regular Customer' },
    { id: 'CUST-1003', name: 'Arjun Verma', email: 'arjun.v@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1004', name: 'Diya Iyer', email: 'diya.iyer@outlook.com', tier: 'Regular Customer' },
    { id: 'CUST-1005', name: 'Ishaan Gupta', email: 'ishaan.g@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1006', name: 'Kavya Nair', email: 'kavya.nair@hotmail.com', tier: 'Regular Customer' },
    { id: 'CUST-1007', name: 'Kabir Kapoor', email: 'kabir.k@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1008', name: 'Meera Deshmukh', email: 'meera.d@gmail.com', tier: 'Regular Customer' },
    { id: 'CUST-1009', name: 'Pranav Joshi', email: 'pranav.j@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1010', name: 'Riya Sen', email: 'riya.sen@gmail.com', tier: 'Regular Customer' },
    { id: 'CUST-1011', name: 'Rohan Malhotra', email: 'rohan.m@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1012', name: 'Sanya Malhotra', email: 'sanya.m@gmail.com', tier: 'Regular Customer' },
    { id: 'CUST-1013', name: 'Shaurya Roy', email: 'shaurya.roy@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1014', name: 'Ananya Rao', email: 'ananya.rao@gmail.com', tier: 'Regular Customer' },
    { id: 'CUST-1015', name: 'Siddharth Saxena', email: 'sid.saxena@gmail.com', tier: 'Flipkart Plus' },
    { id: 'CUST-1016', name: 'Zara Khan', email: 'zara.khan@gmail.com', tier: 'Regular Customer' }
];

class FlipkartSalesDatabase {
    constructor() {
        this.salesData = [];
        this.sellerSettings = {
            sellerName: 'IndoRetail Corp',
            brandName: 'SellerHub Gold',
            gstin: '27AAAAA1111A1Z1',
            warehouse: 'Bhiwandi, Maharashtra',
            email: 'contact@indoretail.in',
            notifications: {
                lowStock: true,
                dailyDigest: true,
                reviews: false
            }
        };
        this.generateDataset();
    }

    generateDataset() {
        const data = [];
        const endDate = new Date(2026, 5, 30); // June 30, 2026
        const startDate = new Date(2025, 6, 1); // July 1, 2025 (~365 days)

        // Helper to check if date falls in Big Billion Days (BBD) window (e.g. October 3 to October 10, 2025)
        const isBBD = (d) => {
            const m = d.getMonth();
            const date = d.getDate();
            return m === 9 && date >= 3 && date <= 10; // Oct 3 - Oct 10
        };

        // Helper to check if date falls in Diwali Sale window (e.g. Nov 5 to Nov 12, 2025)
        const isDiwaliSale = (d) => {
            const m = d.getMonth();
            const date = d.getDate();
            return m === 10 && date >= 5 && date <= 12; // Nov 5 - Nov 12
        };

        // Helper to check if date is a weekend (Friday evening/Saturday/Sunday)
        const isWeekend = (d) => {
            const day = d.getDay();
            return day === 0 || day === 6 || day === 5; // Fri, Sat, Sun
        };

        let current = new Date(startDate);
        let idCounter = 100000;

        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            
            // Determine traffic / order multiplier based on season
            let dailyMultiplier = 1.0;
            let promoName = null;

            if (isBBD(current)) {
                dailyMultiplier = 8.5; // Massive spike during BBD
                promoName = 'Big Billion Days';
            } else if (isDiwaliSale(current)) {
                dailyMultiplier = 5.0; // Big festive spike
                promoName = 'Diwali Festive Dhamaka';
            } else if (isWeekend(current)) {
                dailyMultiplier = 1.4; // 40% more traffic on weekends
            }

            // Random daily base orders: 30 to 60 orders
            const baseOrders = Math.floor(Math.random() * 31) + 30;
            const targetOrdersCount = Math.round(baseOrders * dailyMultiplier);

            for (let i = 0; i < targetOrdersCount; i++) {
                // Select a random product
                const product = BASE_PRODUCTS[Math.floor(Math.random() * BASE_PRODUCTS.length)];
                
                // Units sold (usually 1, sometimes 2-3 for grocery/fashion)
                let quantity = 1;
                if (product.category === CATEGORIES.GROCERY) {
                    quantity = Math.floor(Math.random() * 4) + 1; // 1 to 4
                } else if (product.category === CATEGORIES.FASHION || product.category === CATEGORIES.BEAUTY_PERSONAL_CARE) {
                    quantity = Math.random() < 0.2 ? 2 : 1; // 20% chance of 2
                }

                const price = product.price;
                const revenue = price * quantity;

                // Select a state (weighted random)
                // 30% West, 35% South, 20% North, 15% East
                let state;
                const randState = Math.random();
                if (randState < 0.35) {
                    // South: Karnataka, Tamil Nadu, Telangana, Kerala
                    const southStates = STATES.filter(s => s.region === 'South');
                    state = southStates[Math.floor(Math.random() * southStates.length)];
                } else if (randState < 0.65) {
                    // West: Maharashtra, Gujarat
                    const westStates = STATES.filter(s => s.region === 'West');
                    state = westStates[Math.floor(Math.random() * westStates.length)];
                } else if (randState < 0.85) {
                    // North: Delhi, Uttar Pradesh, Haryana
                    const northStates = STATES.filter(s => s.region === 'North');
                    state = northStates[Math.floor(Math.random() * northStates.length)];
                } else {
                    // East/Other: West Bengal
                    const eastStates = STATES.filter(s => s.region === 'East');
                    state = eastStates.length > 0 ? eastStates[Math.floor(Math.random() * eastStates.length)] : STATES[0];
                }

                // Customer channel (Flipkart Plus, Regular, Quick Commerce)
                // Note: Quick Commerce (Minutes) is only for Grocery and Personal Care, and was introduced recently
                let channel = CHANNELS.REGULAR;
                const randChannel = Math.random();
                if ((product.category === CATEGORIES.GROCERY || product.category === CATEGORIES.BEAUTY_PERSONAL_CARE) && randChannel < 0.4) {
                    channel = CHANNELS.QUICK_COMMERCE;
                } else if (randChannel < 0.35) {
                    channel = CHANNELS.PLUS;
                }

                // Payment Method
                let payment;
                const randPay = Math.random();
                if (channel === CHANNELS.PLUS) {
                    // Plus users use Card/UPI/PayLater more
                    if (randPay < 0.5) payment = PAYMENT_METHODS.UPI;
                    else if (randPay < 0.75) payment = PAYMENT_METHODS.PAY_LATER;
                    else if (randPay < 0.92) payment = PAYMENT_METHODS.CARD;
                    else if (randPay < 0.97) payment = PAYMENT_METHODS.COD;
                    else payment = PAYMENT_METHODS.NET_BANKING;
                } else {
                    if (randPay < 0.4) payment = PAYMENT_METHODS.UPI;
                    else if (randPay < 0.7) payment = PAYMENT_METHODS.COD; // Higher COD for regular users
                    else if (randPay < 0.82) payment = PAYMENT_METHODS.CARD;
                    else if (randPay < 0.95) payment = PAYMENT_METHODS.PAY_LATER;
                    else payment = PAYMENT_METHODS.NET_BANKING;
                }

                // Order Status
                let status = 'Delivered';
                const randStatus = Math.random();
                if (randStatus < 0.04) status = 'Cancelled';
                else if (randStatus < 0.07) status = 'Returned';
                else if (current.getTime() > new Date(2026, 5, 27).getTime()) {
                    // Very recent orders might be Shipped or Processing
                    status = randStatus < 0.6 ? 'Shipped' : 'Processing';
                }

                const plusCusts = MOCK_CUSTOMERS.filter(c => c.tier === 'Flipkart Plus');
                const regCusts = MOCK_CUSTOMERS.filter(c => c.tier === 'Regular Customer');
                let customer;
                if (channel === CHANNELS.PLUS) {
                    customer = plusCusts[Math.floor(Math.random() * plusCusts.length)];
                } else {
                    customer = regCusts[Math.floor(Math.random() * regCusts.length)];
                }

                idCounter++;
                data.push({
                    orderId: `OD${idCounter}`,
                    date: dateStr,
                    timestamp: current.getTime(),
                    productId: product.id,
                    productName: product.name,
                    category: product.category,
                    price: price,
                    quantity: quantity,
                    revenue: revenue,
                    state: state.name,
                    region: state.region,
                    channel: channel,
                    payment: payment,
                    status: status,
                    promotion: promoName,
                    customerId: customer.id,
                    customerName: customer.name,
                    customerEmail: customer.email
                });
            }

            // Move to next day
            current.setDate(current.getDate() + 1);
        }

        this.salesData = data;
    }

    // Filter helper
    getFilteredData(startDateStr, endDateStr, category = 'all', channel = 'all') {
        const start = new Date(startDateStr).getTime();
        const end = new Date(endDateStr).getTime() + (24 * 60 * 60 * 1000) - 1; // End of day

        return this.salesData.filter(order => {
            if (order.timestamp < start || order.timestamp > end) return false;
            if (category !== 'all' && order.category !== category) return false;
            if (channel !== 'all' && order.channel !== channel) return false;
            return true;
        });
    }

    // 1. KPI Aggregation
    getKPIs(startDateStr, endDateStr, category = 'all', channel = 'all') {
        const currentData = this.getFilteredData(startDateStr, endDateStr, category, channel);
        
        // Calculate prior period dates for growth calculation
        const duration = new Date(endDateStr).getTime() - new Date(startDateStr).getTime();
        const priorStart = new Date(new Date(startDateStr).getTime() - duration - (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        const priorEnd = new Date(new Date(startDateStr).getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        const priorData = this.getFilteredData(priorStart, priorEnd, category, channel);

        // Current KPIs
        const currentSales = currentData.reduce((sum, item) => item.status !== 'Cancelled' ? sum + item.revenue : sum, 0);
        const currentOrders = currentData.length;
        const currentDeliveredOrders = currentData.filter(item => item.status === 'Delivered').length;
        const currentReturnedOrders = currentData.filter(item => item.status === 'Returned').length;
        const currentCancelledOrders = currentData.filter(item => item.status === 'Cancelled').length;

        const aov = currentOrders > 0 ? (currentSales / currentOrders) : 0;
        
        // Simulated conversion traffic: base is orders * some multiplier + random fluctuations
        const baseConversionRate = 3.2; // 3.2% default
        const conversionRate = currentOrders > 0 ? +(baseConversionRate + (Math.sin(currentOrders / 100) * 0.4)).toFixed(2) : 0;

        const returnRate = currentOrders > 0 ? +((currentReturnedOrders / currentOrders) * 100).toFixed(2) : 0;
        const cancellationRate = currentOrders > 0 ? +((currentCancelledOrders / currentOrders) * 100).toFixed(2) : 0;

        // Prior KPIs (for growth %)
        const priorSales = priorData.reduce((sum, item) => item.status !== 'Cancelled' ? sum + item.revenue : sum, 0);
        const priorOrders = priorData.length;
        const priorAOV = priorOrders > 0 ? (priorSales / priorOrders) : 0;

        const calcGrowth = (curr, prev) => {
            if (prev === 0) return 0;
            return +(((curr - prev) / prev) * 100).toFixed(1);
        };

        // Active customers is unique products or states size
        const uniqueProductsCount = new Set(currentData.map(d => d.productId)).size;

        return {
            sales: currentSales,
            salesGrowth: calcGrowth(currentSales, priorSales),
            orders: currentOrders,
            ordersGrowth: calcGrowth(currentOrders, priorOrders),
            aov: aov,
            aovGrowth: calcGrowth(aov, priorAOV),
            conversionRate: conversionRate,
            conversionGrowth: +(Math.random() * 0.6 - 0.3).toFixed(2), // slight random fluctuation
            returnRate: returnRate,
            cancellationRate: cancellationRate,
            uniqueProductsSold: uniqueProductsCount
        };
    }

    // 2. Trend Analysis (grouped by date)
    getSalesTrend(startDateStr, endDateStr, category = 'all', channel = 'all') {
        const filtered = this.getFilteredData(startDateStr, endDateStr, category, channel);
        const dailyMap = {};

        // Prepopulate all days in range to avoid gaps
        let curr = new Date(startDateStr);
        const end = new Date(endDateStr);
        while (curr <= end) {
            const ds = curr.toISOString().split('T')[0];
            dailyMap[ds] = { sales: 0, orders: 0, bbdActive: false, diwaliActive: false };
            curr.setDate(curr.getDate() + 1);
        }

        filtered.forEach(order => {
            const ds = order.date;
            if (dailyMap[ds]) {
                if (order.status !== 'Cancelled') {
                    dailyMap[ds].sales += order.revenue;
                }
                dailyMap[ds].orders += 1;
                if (order.promotion === 'Big Billion Days') dailyMap[ds].bbdActive = true;
                if (order.promotion === 'Diwali Festive Dhamaka') dailyMap[ds].diwaliActive = true;
            }
        });

        // Convert map to sorted array
        return Object.keys(dailyMap).sort().map(date => ({
            date,
            formattedDate: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            sales: Math.round(dailyMap[date].sales),
            orders: dailyMap[date].orders,
            bbd: dailyMap[date].bbdActive,
            diwali: dailyMap[date].diwaliActive
        }));
    }

    // 3. Category Distribution
    getCategoryDistribution(startDateStr, endDateStr, category = 'all', channel = 'all') {
        const filtered = this.getFilteredData(startDateStr, endDateStr, category, channel);
        const catMap = {};
        
        // Initialize
        Object.values(CATEGORIES).forEach(c => {
            catMap[c] = { name: c, sales: 0, orders: 0 };
        });

        filtered.forEach(order => {
            if (order.status !== 'Cancelled') {
                catMap[order.category].sales += order.revenue;
            }
            catMap[order.category].orders += 1;
        });

        return Object.values(catMap).sort((a, b) => b.sales - a.sales);
    }

    // 4. Regional Breakdown (Top States)
    getStateDistribution(startDateStr, endDateStr, category = 'all', channel = 'all') {
        const filtered = this.getFilteredData(startDateStr, endDateStr, category, channel);
        const stateMap = {};

        filtered.forEach(order => {
            const st = order.state;
            if (!stateMap[st]) {
                stateMap[st] = { state: st, sales: 0, orders: 0 };
            }
            if (order.status !== 'Cancelled') {
                stateMap[st].sales += order.revenue;
            }
            stateMap[st].orders += 1;
        });

        return Object.values(stateMap).sort((a, b) => b.sales - a.sales);
    }

    // 5. Payment Methods distribution
    getPaymentDistribution(startDateStr, endDateStr, category = 'all', channel = 'all') {
        const filtered = this.getFilteredData(startDateStr, endDateStr, category, channel);
        const payMap = {};

        Object.values(PAYMENT_METHODS).forEach(p => {
            payMap[p] = { name: p, sales: 0, orders: 0 };
        });

        filtered.forEach(order => {
            if (order.status !== 'Cancelled') {
                payMap[order.payment].sales += order.revenue;
            }
            payMap[order.payment].orders += 1;
        });

        return Object.values(payMap).sort((a, b) => b.orders - a.orders);
    }

    // 6. Product Sales Table data
    getProductsPerformance(startDateStr, endDateStr, category = 'all', channel = 'all', searchStr = '') {
        const filtered = this.getFilteredData(startDateStr, endDateStr, category, channel);
        const prodMap = {};

        // Initialize maps for all base products (so we can show stock/minStock accurately)
        BASE_PRODUCTS.forEach(p => {
            prodMap[p.id] = {
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                stock: p.stock,
                minStock: p.minStock,
                rating: p.rating,
                unitsSold: 0,
                revenue: 0,
                status: p.stock === 0 ? 'Out of Stock' : (p.stock <= p.minStock ? 'Low Stock' : 'In Stock')
            };
        });

        // Aggregate sales
        filtered.forEach(order => {
            if (prodMap[order.productId]) {
                if (order.status !== 'Cancelled') {
                    prodMap[order.productId].revenue += order.revenue;
                    prodMap[order.productId].unitsSold += order.quantity;
                }
            }
        });

        // Convert to array
        let list = Object.values(prodMap);

        // Search Filter
        if (searchStr.trim() !== '') {
            const query = searchStr.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
        }

        return list;
    }

    // 7. Recent reviews
    getRecentReviews(count = 5) {
        return MOCK_REVIEWS.slice(0, count);
    }

    // 8. Restock product
    restockProduct(productId, amount) {
        const product = BASE_PRODUCTS.find(p => p.id === productId);
        if (product) {
            product.stock += parseInt(amount) || 0;
            return true;
        }
        return false;
    }

    // 9. Get Customers Performance
    getCustomersPerformance(searchQuery = '', tierFilter = 'all') {
        const customerMap = {};

        // Initialize customerMap from MOCK_CUSTOMERS
        MOCK_CUSTOMERS.forEach(c => {
            customerMap[c.id] = {
                id: c.id,
                name: c.name,
                email: c.email,
                tier: c.tier,
                orderCount: 0,
                totalSpend: 0,
                lastOrderDate: 'N/A',
                lastOrderTimestamp: 0
            };
        });

        // Aggregate order stats for each customer
        this.salesData.forEach(order => {
            if (customerMap[order.customerId]) {
                customerMap[order.customerId].orderCount += 1;
                if (order.status !== 'Cancelled') {
                    customerMap[order.customerId].totalSpend += order.revenue;
                }
                
                // Track last order date
                if (order.timestamp > customerMap[order.customerId].lastOrderTimestamp) {
                    customerMap[order.customerId].lastOrderTimestamp = order.timestamp;
                    customerMap[order.customerId].lastOrderDate = order.date;
                }
            }
        });

        let list = Object.values(customerMap);

        // Filters
        if (tierFilter !== 'all') {
            list = list.filter(c => c.tier === tierFilter);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            list = list.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.id.toLowerCase().includes(query));
        }

        return list;
    }

    // 10. Settings handling
    getSellerSettings() {
        return this.sellerSettings;
    }

    updateSellerSettings(newSettings) {
        this.sellerSettings = { ...this.sellerSettings, ...newSettings };
        return true;
    }
}

// Global window handle for imports
window.FlipkartDB = new FlipkartSalesDatabase();
