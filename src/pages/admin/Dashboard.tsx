import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import withRole from "../withRole";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { dashboardApi } from "../../service/apis/auth.api";
import { userApi } from "../../service/apis/user.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import BarChart from "../../components/chart/BarChart";
import LineChart from "../../components/chart/LineChart";
import data from "../../constants/data";

/* ── Stat card config ── */
const buildStats = (d: any) => {
  // If the backend wraps the payload inside a `data` object, we access it correctly
  const payload = d?.data && d.data.totalUsers !== undefined ? d.data : d;

  return [
    {
      icon: "ph:users-bold",
      label: "Total Users",
      value: payload?.totalUsers ?? "0",
      color: "#3B82F6",
      bg: "#EFF6FF",
      link: "/admin/users",
    },
    {
      icon: "mdi:cart-outline",
      label: "Total Orders",
      value: payload?.totalTransactions ?? "0",
      color: "#10B981",
      bg: "#ECFDF5",
      link: "/admin/order",
    },
    {
      icon: "mdi:headset",
      label: "Support Requests",
      value: payload?.totalSupportRequests ?? "0",
      color: "#F59E0B",
      bg: "#FFFBEB",
      link: "/admin/contact",
    },
    {
      icon: "mdi:cog-outline",
      label: "Total Services",
      value: payload?.totalReports ?? "0",
      color: "#EF4444",
      bg: "#FEF2F2",
      link: "/admin/services",
    },
  ];
};

type DashboardUser = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  profileimageurl?: string;
  _id?: string;
  id?: string;
  email?: string;
};

function Dashboard() {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [dashData, setDashData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [ordersChartData, setOrdersChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Orders",
        data: [],
        backgroundColor: "rgba(43, 85, 31, 0.75)",
      },
    ],
  });

  const [revenueChartData, setRevenueChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Revenue ($)",
        data: [],
        borderColor: "#2B551F",
        backgroundColor: "rgba(43, 85, 31, 0.08)",
      },
    ],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [dash, userList] = await Promise.all([
          dashboardApi({}),
          userApi({ currentPage: 1, limit: 5 }),
        ]);

        console.log("FULL RESPONSE:", dash);

        if (dash?.status === 200) {
          const payload = dash.data || dash;
          setDashData(payload);

          // Update Charts
          if (payload.ordersChart) {
            setOrdersChartData({
              labels: payload.ordersChart.labels,
              datasets: [
                {
                  label: "Orders",
                  data: payload.ordersChart.data,
                  backgroundColor: "rgba(43, 85, 31, 0.75)",
                },
              ],
            });
          }

          if (payload.revenueChart) {
            setRevenueChartData({
              labels: payload.revenueChart.labels,
              datasets: [
                {
                  label: "Revenue ($)",
                  data: payload.revenueChart.data,
                  borderColor: "#2B551F",
                  backgroundColor: "rgba(43, 85, 31, 0.08)",
                },
              ],
            });
          }
        }

        if (userList?.status === 200) {
          const rawUsers =
            userList.users?.users || userList.data?.users || userList.users;
          setUsers(rawUsers || []);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Dashboard data load failed", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = buildStats(dashData);
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const getUserPhone = (u: DashboardUser) => u.phoneNumber || u.phone || "—";
  const getUserAvatar = (u: DashboardUser) =>
    u.profileimageurl || "/default_profile.png";

  if (loading) return <LoadingSpinner />;

  return (
    <div className='admin-dash'>
      {/* ── Header ── */}
      <div className='admin-dash-header'>
        <div>
          <h1 className='admin-dash-title'>Dashboard</h1>
          <p className='admin-dash-sub'>
            Welcome back, <strong>{user?.firstName ?? "Admin"}</strong>
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className='admin-stat-grid'>
        {stats.map((s, i) => (
          <Link to={s.link} className='admin-stat-card' key={i}>
            <div className='admin-stat-icon' style={{ background: s.bg }}>
              <Icon icon={s.icon} width={26} color={s.color} />
            </div>
            <div className='admin-stat-body'>
              <p className='admin-stat-value'>{s.value}</p>
              <p className='admin-stat-label'>{s.label}</p>
            </div>
            <Icon
              icon='mdi:chevron-right'
              width={20}
              className='admin-stat-arrow'
              color='#aaa'
            />
          </Link>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className='admin-charts-row'>
        <div className='admin-chart-card'>
          <h3 className='admin-card-title'>Orders by Month</h3>
          <BarChart chartData={ordersChartData} chartTitle='Orders by Month' />
        </div>
        <div className='admin-chart-card'>
          <h3 className='admin-card-title'>Revenue Trend</h3>
          <LineChart chartData={revenueChartData} />
        </div>
      </div>

      {/* ── Recent Users ── */}
      <div className='admin-table-card'>
        <div className='admin-table-head'>
          <h3 className='admin-card-title'>Recent Users</h3>
          <Link to='/admin/users' className='admin-view-all'>
            View All →
          </Link>
        </div>
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                {/* <th>Status</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className='admin-table-empty'>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <div className='admin-user-cell'>
                        <div className='admin-user-avatar'>
                          <img
                            src={getUserAvatar(u)}
                            alt={`${u.firstName || "User"} profile`}
                            onError={(e) => {
                              e.currentTarget.src = "/default_profile.png";
                            }}
                          />
                        </div>
                        {u.firstName} {u.lastName}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{getUserPhone(u)}</td>
                    {/* <td>
                      <span
                        className={`admin-badge ${u.isAccountVerified ? "admin-badge--active" : "admin-badge--pending"}`}
                      >
                        {u.isAccountVerified ? "Verified" : "Pending"}
                      </span>
                    </td> */}
                    <td>
                      <Link
                        to={`/admin/users/update-user/${u._id || u.id}`}
                        className='admin-btn-view'
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default withRole(Dashboard, ["admin"]);
