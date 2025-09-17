// Mock data fetch, simulate real API
const mockAPI = (period) => {
  // simulate metadata
  const now = new Date();
  const lastUpdated = now.toLocaleString();
  
  // simulate metrics
  const revenue = (Math.random() * 500000 + 50000).toFixed(2);
  const profit = (Math.random() * 200000 + 10000).toFixed(2);
  const expenses = (Math.random() * 300000 + 20000).toFixed(2);
  const cashflow = (Math.random() * 200000 - 50000).toFixed(2);  // could be negative

  const newCustomers = Math.floor(Math.random() * 500 + 50);
  const churnRate = (Math.random() * 5).toFixed(2);
  const csat = (Math.random() * 50 + 50).toFixed(1);  // scale 50‑100
  const conversionRate = (Math.random() * 20).toFixed(2);

  // trend data
  const trendLabels = [];
  const revTrend = [];
  const custTrend = [];
  const days = period || 30;
  for (let i = days; i > 0; i--) {
    trendLabels.push(`${i}d ago`);
    revTrend.push((Math.random() * 50000 + 20000).toFixed(2));
    custTrend.push(Math.floor(Math.random() * 500 + 20));
  }
  
  return {
    lastUpdated,
    revenue, profit, expenses, cashflow,
    newCustomers, churnRate, csat, conversionRate,
    trendLabels, revTrend, custTrend
  };
};

let revenueTrendChart, profitVsExpenseChart, customerTrendChart;

function updateDashboard(period = 30) {
  const data = mockAPI(period);

  document.getElementById('lastUpdated').textContent = data.lastUpdated;

  document.getElementById('revenue').textContent = `$${data.revenue}`;
  document.getElementById('profit').textContent = `$${data.profit}`;
  document.getElementById('expenses').textContent = `$${data.expenses}`;
  document.getElementById('cashflow').textContent = `$${data.cashflow}`;

  document.getElementById('newCustomers').textContent = data.newCustomers;
  document.getElementById('churnRate').textContent = `${data.churnRate}%`;
  document.getElementById('csat').textContent = data.csat;
  document.getElementById('conversionRate').textContent = `${data.conversionRate}%`;

  // Update charts
  // Revenue Trend
  revenueTrendChart.data.labels = data.trendLabels.reverse();
  revenueTrendChart.data.datasets[0].data = data.revTrend.reverse();
  revenueTrendChart.update();

  // Profit vs Expense chart
  profitVsExpenseChart.data.labels = data.trendLabels.reverse();
  profitVsExpenseChart.data.datasets[0].data = data.revTrend.reverse(); // revenue
  profitVsExpenseChart.data.datasets[1].data = data.revTrend.map((x, i) => (x * 0.6).toFixed(2)).reverse(); // mock expense
  profitVsExpenseChart.update();

  // Customer Trend
  customerTrendChart.data.labels = data.trendLabels.reverse();
  customerTrendChart.data.datasets[0].data = data.custTrend.reverse();
  customerTrendChart.update();
}

window.addEventListener('DOMContentLoaded', () => {
  const ctx1 = document.getElementById('revenueTrendChart').getContext('2d');
  revenueTrendChart = new Chart(ctx1, {
    type: 'line',
    data: { labels: [], datasets: [{
      label: 'Revenue over Time',
      data: [],
      borderColor: '#2e7d32',
      backgroundColor: 'rgba(46, 125, 50, 0.2)',
      tension: 0.4,
      fill: true
    }]},
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  const ctx2 = document.getElementById('profitVsExpenseChart').getContext('2d');
  profitVsExpenseChart = new Chart(ctx2, {
    type: 'line',
    data: { labels: [], datasets: [
      {
        label: 'Revenue',
        data: [],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46,125,50,0.2)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Expenses (Est.)',
        data: [],
        borderColor: '#c62828',
        backgroundColor: 'rgba(198,40,40,0.2)',
        fill: false,
        tension: 0.3
      }
    ]},
    options: { responsive: true }
  });

  const ctx3 = document.getElementById('customerTrendChart').getContext('2d');
  customerTrendChart = new Chart(ctx3, {
    type: 'bar',
    data: { labels: [], datasets: [{
      label: 'New Customers',
      data: [],
      backgroundColor: '#66bb6a'
    }]},
    options: { responsive: true }
  });

  // Period change listener
  document.getElementById('periodSelect').addEventListener('change', (e) => {
    updateDashboard(parseInt(e.target.value));
  });

  // Initial load
  updateDashboard(30);
  // Optionally, refresh every minute
  setInterval(() => updateDashboard(parseInt(document.getElementById('periodSelect').value)), 60000);
});
