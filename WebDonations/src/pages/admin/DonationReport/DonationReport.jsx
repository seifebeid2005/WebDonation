import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import "./DonationReport.css";
import AdminLayout from "../AdminLayout";

const admin = {
  username: "adminuser",
  role: "super_admin",
};

const statusColors = {
  completed: "#27ae60",
  pending: "#f39c12",
  failed: "#e74c3c",
  refunded: "#2980b9",
};

const DonationReport = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    fetchDonations();
    // eslint-disable-next-line
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost/WebDonation/backend/admin/donation_report.php",
        { withCredentials: true }
      );
      setDonations(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      setDonations([]);
      setFiltered([]);
    }
    setLoading(false);
  };

  const handleSearch = (val) => {
    setSearchText(val);
    if (!val) {
      setFiltered(donations);
      return;
    }
    setFiltered(
      donations.filter(
        (d) =>
          d.user_name?.toLowerCase().includes(val.toLowerCase()) ||
          d.cause_name?.toLowerCase().includes(val.toLowerCase()) ||
          d.amount?.toString().includes(val) ||
          d.currency?.toLowerCase().includes(val.toLowerCase()) ||
          d.status?.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "donation-report.xlsx"
    );
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Donation Report",
  });

  // Helper for formatting date
  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") date = new Date(date);
    return date.toISOString().slice(0, 16).replace("T", " ");
  };

  // Helper for formatting currency
  const formatCurrency = (amount, currency = "USD") => {
    return (
      currency +
      " " +
      Number(amount || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  return (
    <AdminLayout admin={admin} activePage="report">
      {/* Main Content */}
      <div className="header">
        <h1>
          <i className="fas fa-chart-bar"></i> Donations Report
        </h1>
        <div className="report-actions">
          <input
            className="search-bar"
            type="text"
            placeholder="Search donations..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={fetchDonations}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            <i className="fas fa-file-excel"></i> Export Excel
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <i className="fas fa-print"></i> Print
          </button>
        </div>
      </div>
      <div className="content-section">
        <div className="table-responsive" ref={printRef}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Donor</th>
                <th>Cause</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((donation, idx) => (
                  <tr key={donation.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <span className="donor">{donation.user_name}</span>
                    </td>
                    <td>
                      <span className="cause">{donation.cause_name}</span>
                    </td>
                    <td>
                      <span className="amount">
                        {formatCurrency(donation.amount)}
                      </span>
                    </td>
                    <td>{donation.currency}</td>
                    <td>{formatDate(donation.created_at)}</td>
                    <td>
                      <span
                        className="status-tag"
                        style={{
                          background: statusColors[donation.status] || "#aaa",
                          color: "#fff",
                          padding: "4px 13px",
                          borderRadius: "16px",
                          fontWeight: 600,
                        }}
                      >
                        {donation.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : loading ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    <div className="loading-spinner"></div>
                    Loading donations...
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className="no-data">
                    <i className="fas fa-info-circle"></i> No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DonationReport;
