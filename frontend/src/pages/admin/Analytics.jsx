import { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import './Admin.css'
import './Analytics.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d')
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    try {
      // Mock analytics data
      setAnalytics({
        summary: {
          revenue: { value: 12459.00, change: 12.5 },
          orders: { value: 156, change: 8.2 },
          visitors: { value: 2847, change: 23.1 },
          conversion: { value: 5.5, change: -2.4 },
          averageOrderValue: { value: 79.87, change: 4.1 }
        },
        revenueByDay: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [1200, 1900, 1500, 2100, 1800, 2400, 2000]
        },
        ordersByDay: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [15, 24, 19, 26, 22, 31, 25]
        },
        topProducts: [
          { name: 'Smart Watch Series X', sales: 45, revenue: 13499.55 },
          { name: 'Wireless Earbuds Pro', sales: 38, revenue: 2279.62 },
          { name: 'n8n Automation Pack', sales: 32, revenue: 959.68 },
          { name: 'Power Bank 20k', sales: 28, revenue: 1119.72 },
          { name: 'USB-C Hub', sales: 25, revenue: 749.75 }
        ],
        salesByCategory: [
          { category: 'Electronics', value: 45 },
          { category: 'Accessories', value: 25 },
          { category: 'Digital', value: 20 },
          { category: 'Gadgets', value: 10 }
        ],
        trafficSources: [
          { source: 'Direct', value: 35 },
          { source: 'Social Media', value: 30 },
          { source: 'Search', value: 25 },
          { source: 'Referral', value: 10 }
        ]
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const revenueChartData = {
    labels: analytics?.revenueByDay.labels || [],
    datasets: [{
      label: 'Revenue',
      data: analytics?.revenueByDay.data || [],
      fill: true,
      borderColor: '#0066FF',
      backgroundColor: 'rgba(0, 102, 255, 0.1)',
      tension: 0.4
    }]
  }

  const ordersChartData = {
    labels: analytics?.ordersByDay.labels || [],
    datasets: [{
      label: 'Orders',
      data: analytics?.ordersByDay.data || [],
      backgroundColor: '#00D9FF',
      borderRadius: 6
    }]
  }

  const categoryChartData = {
    labels: analytics?.salesByCategory.map(c => c.category) || [],
    datasets: [{
      data: analytics?.salesByCategory.map(c => c.value) || [],
      backgroundColor: ['#0066FF', '#00D9FF', '#0052CC', '#3385FF'],
      borderWidth: 0
    }]
  }

  const trafficChartData = {
    labels: analytics?.trafficSources.map(t => t.source) || [],
    datasets: [{
      data: analytics?.trafficSources.map(t => t.value) || [],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B6B80' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6B6B80' }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { color: '#A0A0B0', padding: 15 }
      }
    }
  }

  if (isLoading || !analytics) {
    return (
      <div className="admin-analytics">
        <div className="skeleton" style={{ height: '600px' }}></div>
      </div>
    )
  }

  const summaryCards = [
    { label: 'Revenue', value: `$${analytics.summary.revenue.value.toLocaleString()}`, change: analytics.summary.revenue.change },
    { label: 'Orders', value: analytics.summary.orders.value, change: analytics.summary.orders.change },
    { label: 'Visitors', value: analytics.summary.visitors.value.toLocaleString(), change: analytics.summary.visitors.change },
    { label: 'Conversion Rate', value: `${analytics.summary.conversion.value}%`, change: analytics.summary.conversion.change },
    { label: 'Avg Order Value', value: `$${analytics.summary.averageOrderValue.value.toFixed(2)}`, change: analytics.summary.averageOrderValue.change }
  ]

  return (
    <div className="admin-analytics">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Analytics</h1>
        <div className="date-filter">
          <FiCalendar />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="form-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        {summaryCards.map(card => (
          <div key={card.label} className="summary-card">
            <div className="summary-label">{card.label}</div>
            <div className="summary-value">{card.value}</div>
            <div className={`summary-change ${card.change >= 0 ? 'positive' : 'negative'}`}>
              {card.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {Math.abs(card.change)}%
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <div className="admin-card chart-card large">
          <h3>Revenue Overview</h3>
          <div className="chart-container large">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        <div className="admin-card chart-card">
          <h3>Orders by Day</h3>
          <div className="chart-container">
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </div>

        <div className="admin-card chart-card">
          <h3>Sales by Category</h3>
          <div className="chart-container doughnut">
            <Doughnut data={categoryChartData} options={doughnutOptions} />
          </div>
        </div>

        <div className="admin-card chart-card">
          <h3>Traffic Sources</h3>
          <div className="chart-container doughnut">
            <Doughnut data={trafficChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* Top Products */}
        <div className="admin-card top-products-card">
          <h3>Top Selling Products</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts.map((product, idx) => (
                <tr key={idx}>
                  <td className="rank">{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.sales}</td>
                  <td className="revenue">${product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
