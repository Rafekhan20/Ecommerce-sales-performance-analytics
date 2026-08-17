// Flipkart Store Sales Dashboard - Main Controller
// Binds mock database actions to the user interface, manages filters, handles table sorting/searching, and triggers chart redraws.

// State variables for sorting the product table
let currentSortColumn = 'revenue';
let currentSortOrder = 'desc';

// SPA State variables
let currentOrdersPage = 1;
const ordersPerPage = 10;
let activeOrderStatusFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Initialize Charts
    window.DashboardCharts.initCharts();

    // 3. Register Dashboard Event Listeners
    document.getElementById('dateRangeSelect').addEventListener('change', updateDashboard);
    document.getElementById('categorySelect').addEventListener('change', updateDashboard);
    document.getElementById('channelSelect').addEventListener('change', updateDashboard);
    document.getElementById('productSearchInput').addEventListener('input', () => {
        const dateRange = getSelectedDates();
        const category = document.getElementById('categorySelect').value;
        const channel = document.getElementById('channelSelect').value;
        renderProductsTable(dateRange.start, dateRange.end, category, channel);
    });

    // 4. Register Dashboard Table Header Clicks for Sorting
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.dataset.sort;
            if (currentSortColumn === column) {
                currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortOrder = 'desc'; // default to high-to-low
            }
            
            // Update sort icon visual indication
            updateSortIcons();

            // Refresh table
            const dateRange = getSelectedDates();
            const category = document.getElementById('categorySelect').value;
            const channel = document.getElementById('channelSelect').value;
            renderProductsTable(dateRange.start, dateRange.end, category, channel);
        });
    });

    // 5. Register Export Data Button
    document.getElementById('exportBtn').addEventListener('click', handleExport);

    // 6. SPA Routing Listeners
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetTab = link.dataset.tab;
            if (!targetTab) return;

            // Switch active nav class
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // Switch visible view
            document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
            const activeView = document.getElementById(`view-${targetTab}`);
            if (activeView) {
                activeView.classList.add('active');
            }

            // Perform tab-specific updates
            handleTabSwitch(targetTab);
        });
    });

    // 7. Orders Tab Event Listeners
    document.getElementById('orderSearchInput').addEventListener('input', () => {
        currentOrdersPage = 1;
        renderOrdersTable();
    });
    
    document.querySelectorAll('#orderStatusFilters .status-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#orderStatusFilters .status-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeOrderStatusFilter = btn.dataset.status;
            currentOrdersPage = 1;
            renderOrdersTable();
        });
    });

    document.getElementById('prevOrdersPageBtn').addEventListener('click', () => {
        if (currentOrdersPage > 1) {
            currentOrdersPage--;
            renderOrdersTable();
        }
    });

    document.getElementById('nextOrdersPageBtn').addEventListener('click', () => {
        currentOrdersPage++;
        renderOrdersTable();
    });

    // 8. Inventory Tab Event Listeners
    document.getElementById('inventoryCategorySelect').addEventListener('change', renderInventoryTable);
    document.getElementById('inventorySearchInput').addEventListener('input', renderInventoryTable);
    
    document.getElementById('openRestockModalBtn').addEventListener('click', () => openRestockModal());
    document.getElementById('closeRestockModalBtn').addEventListener('click', closeRestockModal);
    document.getElementById('cancelRestockBtn').addEventListener('click', closeRestockModal);
    document.getElementById('restockForm').addEventListener('submit', handleRestockSubmit);

    // 9. Customers Tab Event Listeners
    document.getElementById('customerTierSelect').addEventListener('change', renderCustomersTable);
    document.getElementById('customerSearchInput').addEventListener('input', renderCustomersTable);

    // 10. Settings Tab Event Listeners
    document.getElementById('settingsProfileForm').addEventListener('submit', handleProfileFormSubmit);
    document.getElementById('alertLowStock').addEventListener('change', saveNotificationSettings);
    document.getElementById('alertDailyDigest').addEventListener('change', saveNotificationSettings);
    document.getElementById('alertReviews').addEventListener('change', saveNotificationSettings);

    // 11. Draw Initial Dashboard State
    updateDashboard();

    // 12. Load Reviews Feed
    renderReviews();
});

// Parse the start/end date strings from active preset selector
const getSelectedDates = () => {
    const preset = document.getElementById('dateRangeSelect').value;
    let start = '2026-06-01';
    let end = '2026-06-30';

    switch (preset) {
        case 'last7days':
            start = '2026-06-24';
            end = '2026-06-30';
            break;
        case 'last30days':
            start = '2026-06-01';
            end = '2026-06-30';
            break;
        case 'ytd':
            start = '2026-01-01';
            end = '2026-06-30';
            break;
        case 'bbd2025':
            start = '2025-10-03';
            end = '2025-10-10';
            break;
        case 'diwali2025':
            start = '2025-11-05';
            end = '2025-11-12';
            break;
    }

    return { start, end };
};

// Main trigger to recalculate data and repaint all views
function updateDashboard() {
    const dates = getSelectedDates();
    const category = document.getElementById('categorySelect').value;
    const channel = document.getElementById('channelSelect').value;

    // Date range display description
    const dateIndicator = document.getElementById('dashboard-date-indicator');
    dateIndicator.textContent = `Report Period: ${formatDateDisplay(dates.start)} to ${formatDateDisplay(dates.end)}`;

    // Toggle promotion banner if a campaign view is selected
    handleCampaignBanner(dates.start);

    // Get KPIs & render
    const kpis = window.FlipkartDB.getKPIs(dates.start, dates.end, category, channel);
    renderKPIs(kpis);

    // Fetch and update trend line/bar charts
    const trendData = window.FlipkartDB.getSalesTrend(dates.start, dates.end, category, channel);
    window.DashboardCharts.updateTrendChart(trendData);

    // Fetch and update category doughnut charts
    const categoryData = window.FlipkartDB.getCategoryDistribution(dates.start, dates.end, category, channel);
    window.DashboardCharts.updateCategoryChart(categoryData);

    // Fetch and update state bar chart
    const stateData = window.FlipkartDB.getStateDistribution(dates.start, dates.end, category, channel);
    window.DashboardCharts.updateStateChart(stateData);

    // Fetch and update payment type chart
    const paymentData = window.FlipkartDB.getPaymentDistribution(dates.start, dates.end, category, channel);
    window.DashboardCharts.updatePaymentChart(paymentData);

    // Render Product Performance list
    renderProductsTable(dates.start, dates.end, category, channel);
}

// Render dynamic campaign details
function handleCampaignBanner(startDateStr) {
    const banner = document.getElementById('campaignBanner');
    const badge = document.getElementById('campaignBadge');
    const title = document.getElementById('campaignTitle');
    const subtitle = document.getElementById('campaignSubtitle');
    const multiplier = document.getElementById('campaignMultiplier');

    if (startDateStr === '2025-10-03') {
        // Big Billion Days 2025
        banner.style.display = 'flex';
        badge.textContent = 'Big Billion Days';
        badge.className = 'campaign-badge'; // default style
        title.textContent = 'Flipkart Big Billion Days Campaign Active';
        subtitle.textContent = 'High organic traffic, spike in UPI payments, and high conversion rate across India.';
        multiplier.innerHTML = '<i data-lucide="trending-up" style="margin-right:4px;"></i> +850% Peak';
        banner.style.background = 'linear-gradient(90deg, rgba(40, 116, 240, 0.15) 0%, rgba(255, 210, 0, 0.05) 100%)';
        banner.style.borderColor = 'rgba(40, 116, 240, 0.3)';
    } else if (startDateStr === '2025-11-05') {
        // Diwali Dhamaka
        banner.style.display = 'flex';
        badge.textContent = 'Diwali Dhamaka';
        badge.className = 'campaign-badge';
        title.textContent = 'Diwali Festive Dhamaka Campaign Active';
        subtitle.textContent = 'High purchasing volume in Home & Kitchen and Fashion categories as gift items.';
        multiplier.innerHTML = '<i data-lucide="trending-up" style="margin-right:4px;"></i> +500% Peak';
        banner.style.background = 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(255, 210, 0, 0.05) 100%)';
        banner.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    } else {
        banner.style.display = 'none';
    }
    
    // Refresh newly injected Lucide icons in multiplier
    lucide.createIcons();
}

// Populate KPI elements
function renderKPIs(kpis) {
    // 1. GMV
    document.getElementById('salesKpiVal').textContent = '₹' + kpis.sales.toLocaleString('en-IN');
    renderKpiTrend('salesKpiTrend', kpis.salesGrowth);

    // 2. Orders
    document.getElementById('ordersKpiVal').textContent = kpis.orders.toLocaleString('en-IN');
    renderKpiTrend('ordersKpiTrend', kpis.ordersGrowth);

    // 3. AOV
    document.getElementById('aovKpiVal').textContent = '₹' + Math.round(kpis.aov).toLocaleString('en-IN');
    renderKpiTrend('aovKpiTrend', kpis.aovGrowth);

    // 4. Conversion Rate
    document.getElementById('convKpiVal').textContent = kpis.conversionRate.toFixed(2) + '%';
    renderKpiTrend('convKpiTrend', kpis.conversionGrowth);
}

// Helper to set styling on positive/negative growth rates
function renderKpiTrend(elementId, value) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const isPositive = value >= 0;
    const sign = isPositive ? '+' : '';
    
    el.className = `kpi-trend ${isPositive ? 'positive' : 'negative'}`;
    el.innerHTML = `
        <i data-lucide="${isPositive ? 'trending-up' : 'trending-down'}"></i>
        <span>${sign}${value}%</span>
        <span style="color:var(--text-muted); font-weight:400;">vs prior</span>
    `;

    lucide.createIcons();
}

// Populate Product Performance Table with Search and Sort
function renderProductsTable(start, end, category, channel) {
    const search = document.getElementById('productSearchInput').value;
    const products = window.FlipkartDB.getProductsPerformance(start, end, category, channel, search);

    // Sort products array in memory
    products.sort((a, b) => {
        let valA = a[currentSortColumn];
        let valB = b[currentSortColumn];

        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    No products matching current search or filters.
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(p => {
        const tr = document.createElement('tr');
        
        // Stock Status Badge formatting
        let badgeClass = 'in-stock';
        if (p.stock === 0) badgeClass = 'out-of-stock';
        else if (p.stock <= p.minStock) badgeClass = 'low-stock';

        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${p.id}</td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${p.name}</span>
                    <span class="product-sku">Price: ₹${p.price.toLocaleString('en-IN')}</span>
                </div>
            </td>
            <td>${p.category}</td>
            <td>
                <span class="badge ${badgeClass}">${p.status} (${p.stock} units)</span>
            </td>
            <td style="font-weight: 500;">${p.unitsSold}</td>
            <td style="font-weight: 600; color: var(--text-primary);">₹${p.revenue.toLocaleString('en-IN')}</td>
            <td>
                <div class="rating-stars">
                    ${getStarIcons(p.rating)}
                    <span class="rating-value">${p.rating}</span>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Generate star layout markup for ratings
function getStarIcons(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.3;
    let starsHtml = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHtml += '★';
        } else if (i === fullStars && hasHalf) {
            starsHtml += '½'; // Simulating half star
        } else {
            starsHtml += '<span style="color:var(--text-muted);">★</span>';
        }
    }
    return starsHtml;
}

// Handle sort visual indicators on columns
function updateSortIcons() {
    document.querySelectorAll('th.sortable').forEach(th => {
        const icon = th.querySelector('i');
        if (th.dataset.sort === currentSortColumn) {
            if (currentSortOrder === 'asc') {
                icon.setAttribute('data-lucide', 'chevron-up');
            } else {
                icon.setAttribute('data-lucide', 'chevron-down');
            }
        } else {
            icon.setAttribute('data-lucide', 'chevrons-up-down');
        }
    });
    lucide.createIcons();
}

// Render feedback feed sidebar
function renderReviews() {
    const container = document.getElementById('reviewsListContainer');
    const reviews = window.FlipkartDB.getRecentReviews(5);
    container.innerHTML = '';

    reviews.forEach(rev => {
        const item = document.createElement('div');
        item.className = 'review-item';

        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += i < rev.rating ? '★' : '<span style="color:var(--text-muted);">★</span>';
        }

        item.innerHTML = `
            <div class="review-meta">
                <span class="review-user">${rev.user}</span>
                <span class="review-date">${rev.date}</span>
            </div>
            <div class="review-product">${rev.product}</div>
            <div style="color: var(--fk-yellow); font-size:11px; margin-bottom:4px;">${starsHtml}</div>
            <p class="review-comment">"${rev.comment}"</p>
        `;
        container.appendChild(item);
    });
}

// Format date into human readable "DD MMM YYYY"
function formatDateDisplay(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Trigger Simulated CSV Export
function handleExport() {
    const dates = getSelectedDates();
    const category = document.getElementById('categorySelect').value;
    const channel = document.getElementById('channelSelect').value;
    const search = document.getElementById('productSearchInput').value;

    const data = window.FlipkartDB.getProductsPerformance(dates.start, dates.end, category, channel, search);
    
    // Construct CSV String
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Product ID,Product Name,Category,Price,Units Sold,Revenue,Stock Status,Rating\n";

    data.forEach(p => {
        const row = [
            p.id,
            `"${p.name.replace(/"/g, '""')}"`,
            p.category,
            p.price,
            p.unitsSold,
            p.revenue,
            p.status,
            p.rating
        ].join(",");
        csvContent += row + "\n";
    });

    // Create Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    const filename = `Flipkart_Sales_Report_${dates.start}_to_${dates.end}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    
    // Simulate Download click
    link.click();
    document.body.removeChild(link);

    // Show Export Indicator Toast
    const toast = document.getElementById('exportIndicator');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// SPA Tab Switch dispatcher
function handleTabSwitch(tab) {
    if (tab === 'dashboard') {
        updateDashboard();
        window.DashboardCharts.resizeCharts();
    } else if (tab === 'orders') {
        renderOrdersTable();
    } else if (tab === 'inventory') {
        renderInventoryTable();
    } else if (tab === 'customers') {
        renderCustomersTable();
    } else if (tab === 'analytics') {
        // Force analytics page charts recalculation
        const dates = getSelectedDates();
        const category = document.getElementById('categorySelect')?.value || 'all';
        const channel = document.getElementById('channelSelect')?.value || 'all';
        
        const stateData = window.FlipkartDB.getStateDistribution(dates.start, dates.end, category, channel);
        window.DashboardCharts.updateStateChart(stateData);

        const paymentData = window.FlipkartDB.getPaymentDistribution(dates.start, dates.end, category, channel);
        window.DashboardCharts.updatePaymentChart(paymentData);

        window.DashboardCharts.resizeCharts();
    } else if (tab === 'settings') {
        loadSettingsView();
    }
}

// 1. ORDERS VIEW CONTROLLER
function renderOrdersTable() {
    const searchVal = document.getElementById('orderSearchInput').value.toLowerCase();
    
    // Sort all orders by timestamp (descending)
    let filteredOrders = [...window.FlipkartDB.salesData].sort((a, b) => b.timestamp - a.timestamp);

    // Apply status filter
    if (activeOrderStatusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === activeOrderStatusFilter);
    }

    // Apply search filter (orderId, productName, state, customerName)
    if (searchVal.trim() !== '') {
        filteredOrders = filteredOrders.filter(order => 
            order.orderId.toLowerCase().includes(searchVal) ||
            order.productName.toLowerCase().includes(searchVal) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchVal)) ||
            order.state.toLowerCase().includes(searchVal)
        );
    }

    // Pagination calculations
    const totalOrders = filteredOrders.length;
    const totalPages = Math.max(1, Math.ceil(totalOrders / ordersPerPage));
    if (currentOrdersPage > totalPages) currentOrdersPage = totalPages;

    const startIdx = (currentOrdersPage - 1) * ordersPerPage;
    const endIdx = Math.min(startIdx + ordersPerPage, totalOrders);
    const paginatedOrders = filteredOrders.slice(startIdx, endIdx);

    // Update Pagination UI Controls
    document.getElementById('prevOrdersPageBtn').disabled = currentOrdersPage === 1;
    document.getElementById('nextOrdersPageBtn').disabled = currentOrdersPage === totalPages;
    document.getElementById('ordersPageIndicator').textContent = `Page ${currentOrdersPage} of ${totalPages}`;
    document.getElementById('ordersTableInfo').textContent = totalOrders > 0 
        ? `Showing ${startIdx + 1}-${endIdx} of ${totalOrders} entries` 
        : `Showing 0 of 0 entries`;

    // Render table rows
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    if (paginatedOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    No orders matching search or status filters.
                </td>
            </tr>
        `;
        return;
    }

    paginatedOrders.forEach(o => {
        const tr = document.createElement('tr');
        
        let badgeClass = 'delivered';
        if (o.status === 'Cancelled') badgeClass = 'cancelled';
        else if (o.status === 'Returned') badgeClass = 'returned';
        else if (o.status === 'Shipped') badgeClass = 'shipped';
        else if (o.status === 'Processing') badgeClass = 'processing';

        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${o.orderId}</td>
            <td>${formatDateDisplay(o.date)}</td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${o.customerName || 'Walk-in Customer'}</span>
                    <span class="product-sku" style="font-size:11px;">${o.customerEmail || 'no-email@flipkart.com'}</span>
                </div>
            </td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${o.productName}</span>
                    <span class="product-sku">Price: ₹${o.price.toLocaleString('en-IN')}</span>
                </div>
            </td>
            <td style="font-weight: 500;">${o.quantity}</td>
            <td style="font-weight: 600; color: var(--text-primary);">₹${o.revenue.toLocaleString('en-IN')}</td>
            <td>${o.payment}</td>
            <td>
                <span class="badge ${badgeClass}">${o.status}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 2. INVENTORY VIEW CONTROLLER
function renderInventoryTable() {
    const searchVal = document.getElementById('inventorySearchInput').value;
    const categoryVal = document.getElementById('inventoryCategorySelect').value;

    const products = window.FlipkartDB.getProductsPerformance('2025-07-01', '2026-06-30', categoryVal, 'all', searchVal);

    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    No inventory products found matching filters.
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(p => {
        const tr = document.createElement('tr');
        
        let badgeClass = 'in-stock';
        let progressClass = 'in-stock';
        let progressWidth = 100;

        if (p.stock === 0) {
            badgeClass = 'out-of-stock';
            progressClass = 'out-of-stock';
            progressWidth = 0;
        } else if (p.stock <= p.minStock) {
            badgeClass = 'low-stock';
            progressClass = 'low-stock';
            progressWidth = Math.max(10, Math.round((p.stock / (p.minStock * 2)) * 100));
        } else {
            progressWidth = Math.min(100, Math.round((p.stock / 200) * 100)); // cap at 200 units for 100% progress
        }

        const totalStockValue = p.stock * p.price;

        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${p.id}</td>
            <td>
                <div class="product-cell">
                    <span class="product-name-txt">${p.name}</span>
                    <span class="product-sku">Min stock alert level: ${p.minStock} units</span>
                </div>
            </td>
            <td>${p.category}</td>
            <td>
                <div class="product-cell">
                    <span class="badge ${badgeClass}">${p.status} (${p.stock} units)</span>
                    <div class="stock-progress-container">
                        <div class="stock-progress-bar ${progressClass}" style="width: ${progressWidth}%"></div>
                    </div>
                </div>
            </td>
            <td style="font-weight: 500;">₹${p.price.toLocaleString('en-IN')}</td>
            <td style="font-weight: 600; color: var(--text-primary);">₹${totalStockValue.toLocaleString('en-IN')}</td>
            <td>
                <button class="restock-btn" onclick="openRestockModal('${p.id}')">
                    <i data-lucide="plus-circle" style="width:12px; height:12px;"></i>
                    <span>Restock</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Initialize Lucide icons inside inventory action buttons
    lucide.createIcons();
}

// Modal control for restocking
function openRestockModal(productId = '') {
    const modal = document.getElementById('restockModal');
    const select = document.getElementById('restockProductSelect');
    
    // Clear and populate dropdown
    select.innerHTML = '';
    
    // Fetch all products performance (gives access to name & id)
    const products = window.FlipkartDB.getProductsPerformance('2025-07-01', '2026-06-30', 'all', 'all', '');
    products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.id} - ${p.name} (Stock: ${p.stock})`;
        select.appendChild(opt);
    });

    if (productId !== '') {
        select.value = productId;
    }

    document.getElementById('restockQuantityInput').value = '50';
    modal.classList.add('active');
}

function closeRestockModal() {
    document.getElementById('restockModal').classList.remove('active');
}

function handleRestockSubmit(e) {
    e.preventDefault();
    const productId = document.getElementById('restockProductSelect').value;
    const qty = parseInt(document.getElementById('restockQuantityInput').value) || 0;

    const success = window.FlipkartDB.restockProduct(productId, qty);
    if (success) {
        closeRestockModal();
        renderInventoryTable();
        
        // Refresh product list on dashboard
        const dates = getSelectedDates();
        const category = document.getElementById('categorySelect').value;
        const channel = document.getElementById('channelSelect').value;
        renderProductsTable(dates.start, dates.end, category, channel);
        
        showToast(`Stock updated for ${productId}. Added +${qty} units!`, 'success');
    } else {
        showToast('Failed to update stock. Product not found.', 'error');
    }
}

// Make openRestockModal globally accessible
window.openRestockModal = openRestockModal;

// 3. CUSTOMERS VIEW CONTROLLER
function renderCustomersTable() {
    const searchVal = document.getElementById('customerSearchInput').value;
    const tierVal = document.getElementById('customerTierSelect').value;

    const customers = window.FlipkartDB.getCustomersPerformance(searchVal, tierVal);

    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';

    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    No customers found matching search and filter.
                </td>
            </tr>
        `;
        return;
    }

    customers.forEach(c => {
        const tr = document.createElement('tr');
        
        let tierClass = 'regular';
        if (c.tier === 'Flipkart Plus') tierClass = 'plus';

        tr.innerHTML = `
            <td style="font-family: monospace; font-weight: 600;">${c.id}</td>
            <td style="font-weight: 500;">${c.name}</td>
            <td>${c.email}</td>
            <td>
                <span class="badge ${tierClass}">${c.tier}</span>
            </td>
            <td style="font-weight: 500;">${c.orderCount} orders</td>
            <td style="font-weight: 600; color: var(--text-primary);">₹${Math.round(c.totalSpend).toLocaleString('en-IN')}</td>
            <td>${c.lastOrderDate === 'N/A' ? 'N/A' : formatDateDisplay(c.lastOrderDate)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. SETTINGS VIEW CONTROLLER
function loadSettingsView() {
    const settings = window.FlipkartDB.getSellerSettings();

    document.getElementById('settingsSellerName').value = settings.sellerName;
    document.getElementById('settingsBrandName').value = settings.brandName;
    document.getElementById('settingsEmail').value = settings.email;
    document.getElementById('settingsWarehouse').value = settings.warehouse;

    document.getElementById('alertLowStock').checked = settings.notifications.lowStock;
    document.getElementById('alertDailyDigest').checked = settings.notifications.dailyDigest;
    document.getElementById('alertReviews').checked = settings.notifications.reviews;
}

function handleProfileFormSubmit(e) {
    e.preventDefault();
    const sellerName = document.getElementById('settingsSellerName').value;
    const brandName = document.getElementById('settingsBrandName').value;
    const email = document.getElementById('settingsEmail').value;
    const warehouse = document.getElementById('settingsWarehouse').value;

    const newSettings = {
        sellerName,
        brandName,
        email,
        warehouse
    };

    window.FlipkartDB.updateSellerSettings(newSettings);

    // Dynamic UI Updates
    document.querySelector('.seller-info h4').textContent = sellerName;
    document.getElementById('settingsGoldTierLabel').textContent = brandName;

    showToast('Seller Profile successfully updated!', 'success');
}

function saveNotificationSettings() {
    const lowStock = document.getElementById('alertLowStock').checked;
    const dailyDigest = document.getElementById('alertDailyDigest').checked;
    const reviews = document.getElementById('alertReviews').checked;

    const updatedNotifications = {
        notifications: {
            lowStock,
            dailyDigest,
            reviews
        }
    };

    window.FlipkartDB.updateSellerSettings(updatedNotifications);
    showToast('Alert preferences saved!', 'success');
}

// Dynamic Toast Alert Popup System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.textContent = message;

    if (type === 'success') {
        toastIcon.setAttribute('data-lucide', 'check-circle');
        toast.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else {
        toastIcon.setAttribute('data-lucide', 'alert-circle');
        toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    }
    
    lucide.createIcons();

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
