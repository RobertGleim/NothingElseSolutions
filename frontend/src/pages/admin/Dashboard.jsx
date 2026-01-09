import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp,
  FiPackage, FiArrowUp, FiArrowDown
} from 'react-icons/fi'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { adminAPI } from '../../services/api'
import './Admin.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    visitors: 0,
    conversion: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Mock data for demonstration
      setStats({
        revenue: 12459.00,
        orders: 156,
        visitors: 2847,
        conversion: 5.5
      })

      setRecentOrders([
        { id: 'ORD-001', customer: 'John Doe', total: 89.99, status: 'processing' },
        { id: 'ORD-002', customer: 'Jane Smith', total: 156.00, status: 'shipped' },
        { id: 'ORD-003', customer: 'Bob Wilson', total: 45.50, status: 'delivered' }
      ])

      setBestSellers([
        { name: 'Wireless Earbuds Pro', sales: 45, revenue: 2699.55 },
        { name: 'Smart Watch X', sales: 32, revenue: 9599.68 },
        { name: 'Power Bank 20k', sales: 28, revenue: 1119.72 }
      ])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const revenueChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Revenue',
      data: [1200, 1900, 1500, 2100, 1800, 2400, 2000],
      fill: true,
      borderColor: '#0066FF',
      backgroundColor: 'rgba(0, 102, 255, 0.1)',
      tension: 0.4
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

  const categoryData = {
    labels: ['Electronics', 'Accessories', 'Digital', 'Gadgets'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: ['#0066FF', '#00D9FF', '#0052CC', '#3385FF'],
      borderWidth: 0
    }]
  }

  const statCards = [
    { icon: FiDollarSign, label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+12.5%', positive: true },
    { icon: FiShoppingBag, label: 'Orders', value: stats.orders, change: '+8.2%', positive: true },
    { icon: FiUsers, label: 'Visitors', value: stats.visitors.toLocaleString(), change: '+23.1%', positive: true },
    { icon: FiTrendingUp, label: 'Conversion', value: `${stats.conversion}%`, change: '-2.4%', positive: false }
  ]

  const getStatusBadge = (status) => {
    const colors = {
      processing: 'warning',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'primary'
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          <FiPackage /> Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        {statCards.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card-header">
              <stat.icon className="stat-card-icon" />
              <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? <FiArrowUp /> : <FiArrowDown />}
                {stat.change}
              </span>
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Revenue Chart */}
        <div className="admin-card chart-card">
          <h3>Revenue Overview</h3>
          <div className="chart-container">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="admin-card chart-card small">
          <h3>Sales by Category</h3>
          <div className="chart-container doughnut">
            <Doughnut 
              data={categoryData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }} 
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all-link">View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best Sellers */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Best Sellers</h3>
            <Link to="/admin/analytics" className="view-all-link">View All</Link>
          </div>
          <div className="best-sellers-list">
            {bestSellers.map((product, idx) => (
              <div key={idx} className="best-seller-item">
                <span className="rank">#{idx + 1}</span>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-stats">{product.sales} sales</span>
                </div>
                <span className="product-revenue">${product.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
