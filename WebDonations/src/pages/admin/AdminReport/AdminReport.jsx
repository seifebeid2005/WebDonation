import React, { useEffect, useState, useRef } from "react";
import { fetchAdminReport } from "../../../functions/admin/reports"; // Updated import path
import {
  FaUsers, FaHandsHelping, FaDonate, FaDollarSign, 
  FaChartLine, FaFileExcel, FaPrint, FaSyncAlt,
  FaMoon, FaSun
} from "react-icons/fa";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Legend, CartesianGrid, Area, AreaChart 
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import CountUp from "react-countup";
//importing the AdminReport.css file
import "./AdminReport.css"; // Assuming you have a CSS file for styles

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

// Card themes
const CARD_THEMES = [
  {
    key: "total_users",
    label: "Total Users",
    icon: <FaUsers size={32} />,
    gradient: "from-blue-500 to-blue-700",
    darkGradient: "from-blue-700 to-blue-900",
    motion: { y: [-5, 5] }
  },
  {
    key: "total_causes",
    label: "Total Causes",
    icon: <FaHandsHelping size={32} />,
    gradient: "from-green-500 to-green-700",
    darkGradient: "from-green-700 to-green-900",
    motion: { rotate: [-3, 3] }
  },
  {
    key: "total_donations",
    label: "Total Donations",
    icon: <FaDonate size={32} />,
    gradient: "from-yellow-400 to-yellow-600",
    darkGradient: "from-yellow-600 to-yellow-800",
    motion: { scale: [0.95, 1.05] }
  },
  {
    key: "total_donated_amount",
    label: "Total Donated",
    icon: <FaDollarSign size={32} />,
    gradient: "from-pink-500 to-rose-500",
    darkGradient: "from-pink-700 to-rose-700",
    motion: { y: [-7, 7] }
  },
  {
    key: "total_raised_amount",
    label: "Total Raised",
    icon: <FaChartLine size={32} />,
    gradient: "from-purple-500 to-indigo-600",
    darkGradient: "from-purple-700 to-indigo-800",
    motion: { x: [-5, 5] }
  }
];

// Chart color schemes
const LIGHT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];
const DARK_COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"];

export default function AdminReport() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [username] = useState("JohnRamez06"); // Using the provided username
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [exportLoading, setExportLoading] = useState({ excel: false, pdf: false });
  
  const reportRef = useRef();
  const colors = darkMode ? DARK_COLORS : LIGHT_COLORS;

  // Format currency values
  const currencyFormat = (amount) =>
    amount !== undefined
      ? `$${Number(amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      : "--";

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminReport();
      if (data.error) throw new Error(data.error);
      setStats(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Prepare data for charts
  const pieData = CARD_THEMES.map((card, idx) => ({
    name: card.label,
    value: 
      card.key.includes("amount") 
      ? Number(stats[card.key] ?? 0) 
      : Number(stats[card.key] ?? 0),
    color: colors[idx % colors.length]
  })).filter(item => item.value > 0);

  // Prepare comparison data
  const comparisonData = [
    { name: "Users", value: stats.total_users ?? 0, color: colors[0] },
    { name: "Causes", value: stats.total_causes ?? 0, color: colors[1] },
    { name: "Donations", value: stats.total_donations ?? 0, color: colors[2] }
  ];

  // Prepare trend data - simulated for this example
  const trendData = [
    { name: "Jan", users: 10, donations: 5, amount: 1000 },
    { name: "Feb", users: 15, donations: 8, amount: 1800 },
    { name: "Mar", users: 20, donations: 10, amount: 2500 },
    { name: "Apr", users: 25, donations: 12, amount: 3000 },
    { name: "May", users: stats.total_users ?? 30, donations: stats.total_donations ?? 15, amount: stats.total_donated_amount ?? 4000 }
  ];

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      setExportLoading(prev => ({ ...prev, excel: true }));
      
      // Prepare data in multiple sheets
      const summaryData = CARD_THEMES.map(card => ({
        Statistic: card.label,
        Value: card.key.includes("amount")
          ? currencyFormat(stats[card.key])
          : stats[card.key] ?? "--"
      }));
      
      const trendingData = trendData.map(item => ({
        Month: item.name,
        Users: item.users,
        Donations: item.donations,
        Amount: currencyFormat(item.amount)
      }));

      // Create workbook with sheets
      const wb = XLSX.utils.book_new();
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
      
      const trendSheet = XLSX.utils.json_to_sheet(trendingData);
      XLSX.utils.book_append_sheet(wb, trendSheet, "Monthly Trends");
      
      // Export
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([excelBuffer], { type: 'application/octet-stream' }), 
        `Donation_Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`
      );
    } catch (err) {
      alert("Failed to export report: " + err.message);
    } finally {
      setExportLoading(prev => ({ ...prev, excel: false }));
    }
  };

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Donation_Dashboard_Report_${new Date().toISOString().split('T')[0]}`,
    onBeforeGetContent: () => setExportLoading(prev => ({ ...prev, pdf: true })),
    onAfterPrint: () => setExportLoading(prev => ({ ...prev, pdf: false })),
  });

  // Time-based theme
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 7 || currentHour > 18) {
      setDarkMode(true);
    }
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`admin-report-container ${darkMode ? 'dark' : 'light'} min-h-screen ${
        darkMode 
          ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-indigo-900 text-gray-100" 
          : "bg-gradient-to-tr from-gray-100 via-blue-50 to-purple-50 text-gray-800"
      } py-5 px-4 transition-colors duration-300`}
      ref={reportRef}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <motion.div variants={itemVariants} className="mb-4 md:mb-0">
            <div className="text-sm text-opacity-70">
              {getGreeting()}, <span className="font-medium">{username}</span>
            </div>
            <h1 className="dashboard-title text-3xl md:text-4xl font-extrabold">
              <span className={`bg-gradient-to-r ${
                darkMode 
                  ? "from-blue-400 to-purple-400" 
                  : "from-blue-500 to-purple-600"
              } bg-clip-text text-transparent`}>
                Donation Dashboard Report
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-2"
          >
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`dashboard-button no-print p-2 rounded-full ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
              } transition`}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            
            <button
              onClick={loadData}
              disabled={loading}
              className={`dashboard-button no-print flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode
                  ? "bg-blue-700 hover:bg-blue-600 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } transition-colors`}
              title="Refresh data"
            >
              <FaSyncAlt size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Loading..." : "Refresh"}
            </button>
            
            <button
              onClick={handleExportExcel}
              disabled={exportLoading.excel}
              className={`dashboard-button no-print flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode
                  ? "bg-green-700 hover:bg-green-600 text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              } transition-colors`}
              title="Export as Excel"
            >
              {exportLoading.excel ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Exporting...
                </span>
              ) : (
                <>
                  <FaFileExcel size={16} />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="inline sm:hidden">Excel</span>
                </>
              )}
            </button>
            
            <button
              onClick={handlePrint}
              disabled={exportLoading.pdf}
              className={`dashboard-button no-print flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode
                  ? "bg-amber-700 hover:bg-amber-600 text-white" 
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              } transition-colors`}
              title="Print report"
            >
              <FaPrint size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
          </motion.div>
        </div>
        
        {/* Stats Cards */}
        <motion.div 
          variants={itemVariants} 
          className="stat-cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8"
        >
          {CARD_THEMES.map((card, idx) => (
            <motion.div
              key={card.key}
              className={`stat-card relative rounded-2xl shadow-xl p-5 overflow-hidden ${
                darkMode
                  ? `bg-gradient-to-br ${card.darkGradient} text-white` 
                  : `bg-white text-gray-800`
              }`}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="card-gradient-bar absolute top-0 left-0 w-full"
                style={{ 
                  background: `linear-gradient(to right, ${colors[idx]}, ${colors[(idx+1) % colors.length]})` 
                }}
              />
              <motion.div 
                animate={card.motion} 
                transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                className={`stat-card-icon mb-3 text-3xl ${
                  darkMode 
                    ? "text-white" 
                    : `text-${card.gradient.split(" ")[0].replace("from-", "")}`
                }`}
              >
                {card.icon}
              </motion.div>
              
              <h3 className="text-lg font-medium">{card.label}</h3>
              
              <div className={`mt-2 text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {loading ? (
                  <div className={`animate-pulse h-8 w-20 rounded ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`} />
                ) : (
                  card.key.includes("amount") ? (
                    <CountUp 
                      start={0}
                      end={stats[card.key] || 0}
                      duration={1.5}
                      separator=","
                      decimals={2}
                      decimal="."
                      prefix="$"
                    />
                  ) : (
                    <CountUp 
                      start={0}
                      end={stats[card.key] || 0}
                      duration={1.5}
                      separator=","
                    />
                  )
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500 text-white rounded-lg"
          >
            <div className="font-medium">Error loading dashboard data:</div>
            <div>{error}</div>
          </motion.div>
        )}

        {/* Charts Section */}
        <motion.div 
          variants={itemVariants}
          className="chart-grid grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Distribution Pie Chart */}
          <motion.div 
            variants={chartVariants}
            className={`chart-container rounded-2xl shadow-lg p-6 ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-5">Distribution Analysis</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    labelLine
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    isAnimationActive
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      name.includes("Amount") ? currencyFormat(value) : value.toLocaleString(),
                      name
                    ]}
                    contentStyle={darkMode ? { backgroundColor: "#1F2937", color: "#F9FAFB", border: "none" } : undefined}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Monthly Trend Chart */}
          <motion.div 
            variants={chartVariants}
            className={`chart-container rounded-2xl shadow-lg p-6 ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-5">Monthly Performance</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="name" tick={{ fill: darkMode ? "#F9FAFB" : "#111827" }} />
                  <YAxis tick={{ fill: darkMode ? "#F9FAFB" : "#111827" }} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "amount") return [currencyFormat(value), "Donation Amount"];
                      return [value, name === "users" ? "Users" : "Donations"];
                    }}
                    contentStyle={darkMode ? { backgroundColor: "#1F2937", color: "#F9FAFB", border: "none" } : undefined}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="users" stackId="1" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="donations" stackId="2" stroke={colors[2]} fill={colors[2]} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="amount" stackId="3" stroke={colors[4]} fill={colors[4]} fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>
        
        {/* Comparison Chart */}
        <motion.div 
          variants={itemVariants}
          className={`chart-container rounded-2xl shadow-lg p-6 mb-8 ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-xl font-semibold mb-5">Comparison Analysis</h3>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={comparisonData}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                barGap={0}
                barSize={60}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="name" tick={{ fill: darkMode ? "#F9FAFB" : "#111827" }} />
                <YAxis tick={{ fill: darkMode ? "#F9FAFB" : "#111827" }} />
                <Tooltip
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={darkMode ? { backgroundColor: "#1F2937", color: "#F9FAFB", border: "none" } : undefined}
                />
                <Bar dataKey="value" name="Count">
                  {comparisonData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        
        {/* Summary & Last Updated */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className={`dashboard-summary p-6 rounded-2xl ${
            darkMode ? "bg-gray-800 bg-opacity-80" : "bg-blue-50"
          }`}>
            <h3 className="text-xl font-semibold mb-3">Dashboard Summary</h3>
            <p className="mb-4">
              This dashboard provides a comprehensive overview of your donation platform's performance.
              Your platform currently has <span className="stat-highlight">{stats.total_users ?? 0}</span> registered users and 
              <span className="stat-highlight"> {stats.total_causes ?? 0}</span> active causes.
              The total amount raised across all campaigns is <span className="stat-highlight">{currencyFormat(stats.total_raised_amount ?? 0)}</span>, 
              with <span className="stat-highlight">{stats.total_donations ?? 0}</span> confirmed donations totaling 
              <span className="stat-highlight"> {currencyFormat(stats.total_donated_amount ?? 0)}</span>.
            </p>
            <div className="flex justify-end items-center text-sm text-opacity-70">
              <div>Last updated: {lastUpdated.toLocaleString()}</div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center">
          <div className="w-20 h-1 mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
          <div className={darkMode ? "text-gray-400" : "text-gray-500"}>
            © {new Date().getFullYear()} WebDonation Dashboard
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}