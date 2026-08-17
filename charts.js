// Flipkart Store Sales Dashboard - Chart Configuration Module
// Integrates Chart.js with custom gradients, theme settings, and dynamic data rendering.

let trendChart = null;
let categoryChart = null;
let stateChart = null;
let paymentChart = null;

// Helper to format currency in Lakhs/Thousands (INR)
const formatCurrency = (value) => {
    if (value >= 100000) {
        return '₹' + (value / 100000).toFixed(2) + 'L';
    } else if (value >= 1000) {
        return '₹' + (value / 1000).toFixed(1) + 'K';
    }
    return '₹' + value;
};

// Global chart styling defaults
const applyChartDefaults = () => {
    Chart.defaults.color = '#9ca3af'; // gray-400
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.tooltip.backgroundColor = '#0f1626';
    Chart.defaults.plugins.tooltip.titleColor = '#f3f4f6';
    Chart.defaults.plugins.tooltip.bodyColor = '#f3f4f6';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
};

// Initialize All Charts
const initCharts = () => {
    applyChartDefaults();

    // 1. Sales & Orders Trend Line Chart
    const trendCtx = document.getElementById('trendChartCanvas').getContext('2d');
    
    // Create custom plugin to highlight BBD & Diwali periods
    const campaignHighlightPlugin = {
        id: 'campaignHighlight',
        beforeDraw: (chart) => {
            const { ctx, chartArea, scales: { x } } = chart;
            if (!chartArea) return;

            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);
            
            // Iterate points to find campaign indices
            let bbdStart = null, bbdEnd = null;
            let diwaliStart = null, diwaliEnd = null;

            chart.data.labels.forEach((label, index) => {
                const dataPoint = chart.data.datasets[0].rawPoints[index];
                if (dataPoint) {
                    if (dataPoint.bbd) {
                        if (bbdStart === null) bbdStart = index;
                        bbdEnd = index;
                    }
                    if (dataPoint.diwali) {
                        if (diwaliStart === null) diwaliStart = index;
                        diwaliEnd = index;
                    }
                }
            });

            ctx.save();
            // Highlight BBD
            if (bbdStart !== null && bbdEnd !== null) {
                const xStart = x.getPixelForTick(bbdStart);
                const xEnd = x.getPixelForTick(bbdEnd);
                ctx.fillStyle = 'rgba(40, 116, 240, 0.06)';
                ctx.fillRect(xStart, chartArea.top, xEnd - xStart, chartArea.bottom - chartArea.top);
                
                // Top border highlight
                ctx.strokeStyle = 'rgba(40, 116, 240, 0.2)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(xStart, chartArea.top);
                ctx.lineTo(xEnd, chartArea.top);
                ctx.stroke();
            }
            
            // Highlight Diwali
            if (diwaliStart !== null && diwaliEnd !== null) {
                const xStart = x.getPixelForTick(diwaliStart);
                const xEnd = x.getPixelForTick(diwaliEnd);
                ctx.fillStyle = 'rgba(255, 210, 0, 0.04)';
                ctx.fillRect(xStart, chartArea.top, xEnd - xStart, chartArea.bottom - chartArea.top);
                
                // Top border highlight
                ctx.strokeStyle = 'rgba(255, 210, 0, 0.2)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(xStart, chartArea.top);
                ctx.lineTo(xEnd, chartArea.top);
                ctx.stroke();
            }
            ctx.restore();
        }
    };

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Sales Revenue',
                    data: [],
                    yAxisID: 'ySales',
                    borderColor: '#2874f0',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#2874f0',
                    pointHoverBackgroundColor: '#2874f0',
                    pointRadius: (context) => {
                        const raw = context.chart.data.datasets[0].rawPoints[context.dataIndex];
                        return (raw && (raw.bbd || raw.diwali)) ? 4 : 0;
                    },
                    pointHoverRadius: 6,
                    tension: 0.35,
                    fill: true,
                    backgroundColor: 'transparent', // Will be set dynamically to gradient
                    rawPoints: []
                },
                {
                    label: 'Orders Count',
                    data: [],
                    yAxisID: 'yOrders',
                    borderColor: '#ffd200',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    pointBackgroundColor: '#ffd200',
                    pointHoverBackgroundColor: '#ffd200',
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 16,
                        boxHeight: 8,
                        padding: 15,
                        color: '#f3f4f6'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const datasetLabel = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (context.datasetIndex === 0) {
                                return `${datasetLabel}: ₹${value.toLocaleString('en-IN')}`;
                            } else {
                                return `${datasetLabel}: ${value} orders`;
                            }
                        },
                        afterBody: (context) => {
                            const dataIndex = context[0].dataIndex;
                            const raw = context[0].chart.data.datasets[0].rawPoints[dataIndex];
                            if (raw && raw.bbd) return '🔥 Event: Big Billion Days';
                            if (raw && raw.diwali) return '🪔 Event: Diwali Festive Sale';
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.03)'
                    },
                    ticks: {
                        maxTicksLimit: 8
                    }
                },
                ySales: {
                    type: 'linear',
                    position: 'left',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        callback: (value) => formatCurrency(value)
                    }
                },
                yOrders: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false // avoid overlaying gridlines
                    },
                    ticks: {
                        callback: (value) => value + ' ord'
                    }
                }
            }
        },
        plugins: [campaignHighlightPlugin]
    });

    // 2. Category Donut Chart
    const catCtx = document.getElementById('categoryChartCanvas').getContext('2d');
    categoryChart = new Chart(catCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3b82f6', // Electronics - Blue
                    '#ec4899', // Fashion - Pink
                    '#10b981', // Home - Green
                    '#f59e0b', // Beauty - Yellow/Amber
                    '#8b5cf6'  // Grocery - Purple
                ],
                borderWidth: 1.5,
                borderColor: '#0f1626',
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 15,
                        color: '#f3f4f6'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `Sales: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '72%'
        }
    });

    // 3. State Sales Horizontal Bar Chart
    const stateCtx = document.getElementById('stateChartCanvas').getContext('2d');
    stateChart = new Chart(stateCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Sales Revenue',
                data: [],
                backgroundColor: '#2874f0', // Will be gradient
                borderRadius: 4,
                borderSkipped: false,
                barThickness: 14
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Sales: ₹${context.parsed.x.toLocaleString('en-IN')}`
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.04)'
                    },
                    ticks: {
                        callback: (value) => formatCurrency(value)
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // 4. Payment Polar Chart
    const payCtx = document.getElementById('paymentChartCanvas').getContext('2d');
    paymentChart = new Chart(payCtx, {
        type: 'polarArea',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)', // UPI - green
                    'rgba(245, 158, 11, 0.7)', // COD - orange
                    'rgba(59, 130, 246, 0.7)', // Pay Later - blue
                    'rgba(139, 92, 246, 0.7)', // Card - purple
                    'rgba(107, 114, 128, 0.7)' // Netbanking - gray
                ],
                borderWidth: 1.5,
                borderColor: '#0f1626'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        display: false
                    },
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 8,
                        padding: 10,
                        color: '#f3f4f6'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => ` Orders: ${context.parsed} (${((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`
                    }
                }
            }
        }
    });
};

// Update Trend Charts with Dynamic Canvas Gradients
const updateTrendChart = (trendData) => {
    if (!trendChart) return;

    const labels = trendData.map(d => d.formattedDate);
    const salesValues = trendData.map(d => d.sales);
    const orderValues = trendData.map(d => d.orders);

    trendChart.data.labels = labels;
    trendChart.data.datasets[0].data = salesValues;
    trendChart.data.datasets[0].rawPoints = trendData;
    trendChart.data.datasets[1].data = orderValues;

    // Apply linear gradient fill to Sales line dynamically based on container size
    const ctx = document.getElementById('trendChartCanvas').getContext('2d');
    const chartHeight = trendChart.height || 260;
    const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
    gradient.addColorStop(0, 'rgba(40, 116, 240, 0.25)');
    gradient.addColorStop(1, 'rgba(40, 116, 240, 0.005)');
    trendChart.data.datasets[0].backgroundColor = gradient;

    trendChart.update();
};

// Update Category Donut Chart
const updateCategoryChart = (catData) => {
    if (!categoryChart) return;

    categoryChart.data.labels = catData.map(d => d.name);
    categoryChart.data.datasets[0].data = catData.map(d => d.sales);
    categoryChart.update();
};

// Update State Bar Chart
const updateStateChart = (stateData) => {
    if (!stateChart) return;

    // Limit to top 6 states
    const topStates = stateData.slice(0, 6);

    stateChart.data.labels = topStates.map(d => d.state);
    stateChart.data.datasets[0].data = topStates.map(d => d.sales);

    // Apply linear gradient horizontally to bars
    const ctx = document.getElementById('stateChartCanvas').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, '#1e56b8');
    gradient.addColorStop(1, '#2874f0');
    stateChart.data.datasets[0].backgroundColor = gradient;

    stateChart.update();
};

// Update Payment Distribution Chart
const updatePaymentChart = (payData) => {
    if (!paymentChart) return;

    paymentChart.data.labels = payData.map(d => d.name);
    paymentChart.data.datasets[0].data = payData.map(d => d.orders);
    paymentChart.update();
};

// Resize all charts when container displays change
const resizeCharts = () => {
    if (trendChart) {
        trendChart.resize();
        trendChart.update();
    }
    if (categoryChart) {
        categoryChart.resize();
        categoryChart.update();
    }
    if (stateChart) {
        stateChart.resize();
        stateChart.update();
    }
    if (paymentChart) {
        paymentChart.resize();
        paymentChart.update();
    }
};

// Global handle for charts API
window.DashboardCharts = {
    initCharts,
    updateTrendChart,
    updateCategoryChart,
    updateStateChart,
    updatePaymentChart,
    resizeCharts
};
