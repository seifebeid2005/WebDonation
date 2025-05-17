import { useState, useEffect } from 'react';
import Header from '../Header';
import './AdminReport.css';

const AdminReport = () => {
  const [reportType, setReportType] = useState('donations');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set default date range to current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setDateRange({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const generateReport = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setReportData(null);
      
      const response = await fetch('http://localhost/WebDonation/Backend/api/admin/report.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reportData) return;
    
    let csvContent = '';
    let headers = [];
    let rows = [];
    
    // Create headers based on report type
    if (reportType === 'donations') {
      headers = ['ID', 'User', 'Cause', 'Amount', 'Date'];
      rows = reportData.map(item => [
        item.id,
        item.userName,
        item.causeName,
        item.amount,
        item.date
      ]);
    } else if (reportType === 'users') {
      headers = ['ID', 'Name', 'Email', 'Registration Date', 'Donations Count', 'Total Amount'];
      rows = reportData.map(item => [
        item.id,
        item.name,
        item.email,
        item.created_at,
        item.donations_count,
        item.total_amount
      ]);
    } else if (reportType === 'causes') {
      headers = ['ID', 'Title', 'Goal Amount', 'Current Amount', 'Donations Count', 'Status'];
      rows = reportData.map(item => [
        item.id,
        item.title,
        item.goal_amount,
        item.current_amount,
        item.donations_count,
        item.status
      ]);
    }
    
    // Add headers
    csvContent += headers.join(',') + '\n';
    
    // Add rows
    rows.forEach(row => {
      csvContent += row.map(cell => {
        // Wrap cells with commas in quotes
        if (cell && cell.toString().includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${dateRange.startDate}_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-report">
      <Header />
      <div className="report-container">
        <h2>Generate Reports</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="report-form-container">
          <form onSubmit={generateReport} className="report-form">
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select 
                id="reportType" 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="donations">Donations Report</option>
                <option value="users">Users Report</option>
                <option value="causes">Causes Report</option>
              </select>
            </div>
            
            <div className="date-range">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input 
                  type="date" 
                  id="endDate" 
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleInputChange}
                  min={dateRange.startDate}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>
        </div>
        
        {reportData && (
          <div className="report-results">
            <div className="report-header">
              <h3>
                {reportType === 'donations' && 'Donations Report'}
                {reportType === 'users' && 'Users Report'}
                {reportType === 'causes' && 'Causes Report'}
              </h3>
              <button onClick={downloadCSV} className="download-btn">
                Download CSV
              </button>
            </div>
            
            <div className="report-table-container">
              {reportType === 'donations' && (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Cause</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length > 0 ? (
                      reportData.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.userName}</td>
                          <td>{item.causeName}</td>
                          <td>${item.amount}</td>
                          <td>{new Date(item.date).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">No donations found for the selected period</td>
                      </tr>
                    )}
                  </tbody>
                  {reportData.length > 0 && (
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">Total</td>
                        <td colSpan="2" className="total-value">
                          ${reportData.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              )}
              
              {reportType === 'users' && (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registration Date</th>
                      <th>Donations Count</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length > 0 ? (
                      reportData.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td>{item.donations_count}</td>
                          <td>${parseFloat(item.total_amount).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No users found for the selected period</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              
              {reportType === 'causes' && (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Goal Amount</th>
                      <th>Current Amount</th>
                      <th>Donations Count</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length > 0 ? (
                      reportData.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.title}</td>
                          <td>${parseFloat(item.goal_amount).toFixed(2)}</td>
                          <td>${parseFloat(item.current_amount).toFixed(2)}</td>
                          <td>{item.donations_count}</td>
                          <td>
                            <span className={`status-badge ${item.status}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No causes found for the selected period</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
