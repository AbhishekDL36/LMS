// AdminDashboard.jsx - Admin Dashboard with platform statistics
// Shows admin overview: total users, students, teachers, courses, enrollments
// All cards are clickable for drill-down management

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admin stats when component loads
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getToken();

        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

        // Call backend to get admin stats
        const response = await fetch(
          'http://localhost:5000/api/admin/stats',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch admin stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Error fetching dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show when no stats data
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <p className="text-center text-gray-600 mb-4">
            No dashboard data available
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Platform-wide statistics and management overview
          </p>
        </div>

        {/* Dashboard cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Card 1: Total Users */}
          <div 
            onClick={() => navigate('/app/admin/users')}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Click to view all users
            </p>
          </div>

          {/* Card 2: Total Students */}
          <div 
            onClick={() => navigate('/app/admin/users?role=student')}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="text-4xl">🎓</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Students registered
            </p>
          </div>

          {/* Card 3: Total Teachers */}
          <div 
            onClick={() => navigate('/app/admin/teachers')}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Teachers
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.totalTeachers}
                </p>
              </div>
              <div className="text-4xl">👨‍🏫</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Teachers on platform
            </p>
          </div>

          {/* Card 4: Total Courses */}
          <div 
            onClick={() => navigate('/app/admin/courses')}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Courses available
            </p>
          </div>

          {/* Card 5: Total Enrollments */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Total Enrollments
                </p>
                <p className="text-3xl font-bold text-pink-600">
                  {stats.totalEnrollments}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Student enrollments
            </p>
          </div>
        </div>

        {/* Summary section */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Platform Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stat 1 */}
            <div>
              <p className="text-gray-700 font-medium">User Breakdown</p>
              <p className="text-sm text-gray-600 mt-1">
                Total {stats.totalUsers} user(s): {stats.totalStudents} student(s), {stats.totalTeachers} teacher(s)
              </p>
            </div>

            {/* Stat 2 */}
            <div>
              <p className="text-gray-700 font-medium">Learning Activity</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalCourses} course(s) with {stats.totalEnrollments} enrollment(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
