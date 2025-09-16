const mockAPI = () => {
  return {
    revenue: `$${(Math.random() * 100000).toFixed(2)}`,
    customers: Math.floor(Math.random() * 1000),
    conversion: `${(Math.random() * 10).toFixed(2)}%`,
    churn: `${(Math.random() * 5).toFixed(2)}%`,
    chartData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
  };
};

function updateKPI() {
  const data = mockAPI();
  document.getElementById("revenue").textContent = data.revenue;
  document.getElementById("customers").textContent = data.customers;
  document.getElementById("conversion").textContent = data.conversion;
  document.getElementById("churn").textContent = data.churn;
  updateChart(data.chartData);
}

// Chart.js setup
const ctx = document.getElementById("kpiChart").getContext("2d");
let kpiChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Weekly Performance",
      backgroundColor: "#a5d6a7",
      borderColor: "#2e7d32",
      data: [],
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" }
    }
  }
});

function updateChart(data) {
  kpiChart.data.datasets[0].data = data;
  kpiChart.update();
}

// Initial load
updateKPI();
setInterval(updateKPI, 5000); // Update every 5 seconds
