import { useEffect, useState } from "react";
import axiosInstance from "@src/providers/axiosInstance";
import { CheckCircle, Clock, ClipboardList } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, gradient }) => (
  <div
    className={`rounded-xl p-5 text-white shadow-lg hover:scale-[1.02] transition-all duration-300 ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
      <div className="bg-white/20 p-3 rounded-lg">
        <Icon size={26} />
      </div>
    </div>
  </div>
);

const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/auth/dashboard/staff")
      .then((res) => setData(res.data.data))
      .catch(() => setData(null));
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading dashboard...
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          👋 Welcome Back
        </h2>
        <p className="text-gray-500 mt-1">
          Here’s a quick overview of your work status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Tasks"
          value={data.assignedTasks}
          icon={ClipboardList}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
        />

        <StatCard
          title="Completed Tasks"
          value={data.completedTasks}
          icon={CheckCircle}
          gradient="bg-gradient-to-r from-green-500 to-emerald-500"
        />

        <StatCard
          title="Pending Reviews"
          value={data.pendingReviews}
          icon={Clock}
          gradient="bg-gradient-to-r from-orange-500 to-amber-500"
        />
      </div>

      {/* Footer Card */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Productivity Tip 💡
        </h3>
        <p className="text-gray-500 mt-2">
          Focus on completing high-priority tasks first to reduce pending
          reviews and improve overall performance.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
