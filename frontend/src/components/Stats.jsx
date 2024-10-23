import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_LOCALHOST}/api/invoice/stats?type=${period}`);
      const result = await response.json();
      
      if (result.success) {
        const formattedData = result.data.map(item => ({
          ...item,
          displayDate: formatDate(item.week_start || item.date || item.month_start),
          formattedRevenue: formatRevenue(item.total_revenue)
        }));
        setData(formattedData);
        console.log(formattedData)
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return period === 'monthly' 
      ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatRevenue = (value) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000)}M`;
    }
    if (value >= 1000) {
      return `Rp ${Math.floor(value / 1000)}K`;
    }
    return `Rp ${value}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Revenue Overview
        </h2>
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((type) => (
            <button
              key={type}
              onClick={() => setPeriod(type)}
              className={`px-4 py-2 rounded-lg capitalize ${
                period === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              interval="preserveEnd"
            />
            <YAxis 
              tickFormatter={formatRevenue}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => formatRevenue(value)}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_revenue"
              name="Revenue"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">Total Revenue</p>
          <p className="text-xl font-semibold">
            {formatRevenue(data.reduce((sum, item) => sum + item.total_revenue, 0))}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Average Revenue</p>
          <p className="text-xl font-semibold">
            {formatRevenue(
              data.reduce((sum, item) => sum + item.total_revenue, 0) / data.length
            )}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600">Highest Revenue</p>
          <p className="text-xl font-semibold">
            {formatRevenue(Math.max(...data.map(item => item.total_revenue)))}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-600">Lowest Revenue</p>
          <p className="text-xl font-semibold">
            {formatRevenue(Math.min(...data.map(item => item.total_revenue)))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;