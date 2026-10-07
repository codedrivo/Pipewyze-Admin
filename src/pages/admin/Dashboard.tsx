import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import withRole from "../withRole";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { dashboardApi } from "../../service/apis/auth.api";
import { userApi } from "../../service/apis/user.api";
import { getHomeOwnerEquipment } from "../../service/apis/equipment.api";
import { getEssentialTools } from "../../service/apis/essentialTool.api";
import { getMaintenanceGuides } from "../../service/apis/maintenanceGuide.api";
import { getPlumbingCodes } from "../../service/apis/plumbingCode.api";
import { getSupportRequests } from "../../service/apis/support.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import LineChart from "../../components/chart/LineChart";
import BarChart from "../../components/chart/BarChart";

/* ── Stat card config ── */
const buildStats = (d: any, counts: any) => {
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
      icon: "lucide:receipt",
      label: "Transactions",
      value: payload?.totalTransactions ?? "0",
      color: "#2563EB",
      bg: "#DBEAFE",
      link: "/admin/transactions",
    },
    {
      icon: "lucide:wrench",
      label: "Equipment List",
      value: counts.equipment ?? "0",
      color: "#059669",
      bg: "#ECFDF5",
      link: "/admin/equipment",
    },
    {
      icon: "lucide:hammer",
      label: "Essential Tools",
      value: counts.essentialTools ?? "0",
      color: "#D97706",
      bg: "#FFFBEB",
      link: "/admin/essential-tools",
    },
    {
      icon: "lucide:book-open",
      label: "Maintenance Guide",
      value: counts.maintenanceGuides ?? "0",
      color: "#7C3AED",
      bg: "#F3E8FF",
      link: "/admin/maintenance-guides",
    },
    {
      icon: "lucide:book",
      label: "Plumbing Code",
      value: counts.plumbingCodes ?? "0",
      color: "#0284C7",
      bg: "#E0F2FE",
      link: "/admin/plumbing-codes",
    },
    {
      icon: "lucide:message-square",
      label: "Support Requests",
      value: counts.supportRequests ?? "0",
      color: "#DC2626",
      bg: "#FEF2F2",
      link: "/admin/support",
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
  subscriptionTier?: string;
};

function Dashboard() {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [dashData, setDashData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [counts, setCounts] = useState({
    equipment: 0,
    essentialTools: 0,
    maintenanceGuides: 0,
    plumbingCodes: 0,
    supportRequests: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dash, userList, eqRes, toolsRes, guideRes, codeRes, suppRes] =
          await Promise.all([
            dashboardApi({}),
            userApi({ currentPage: 1, limit: 5 }),
            getHomeOwnerEquipment().catch(() => null),
            getEssentialTools().catch(() => null),
            getMaintenanceGuides().catch(() => null),
            getPlumbingCodes().catch(() => null),
            getSupportRequests().catch(() => null),
          ]);

        if (dash?.status === 200) {
          const payload = dash.data || dash;
          setDashData(payload);
        }

        if (userList?.status === 200) {
          const rawUsers =
            userList.users?.users || userList.data?.users || userList.users;
          setUsers(rawUsers || []);
        } else {
          setUsers([]);
        }

        const eqList = eqRes?.equipment || eqRes?.data?.equipment || [];
        const toolsList = toolsRes?.tools || toolsRes?.data?.tools || [];
        const guideList = guideRes?.guides || guideRes?.data?.guides || [];
        const codeList = codeRes?.codes || codeRes?.data?.codes || [];
        const suppList = suppRes?.requests || suppRes?.data?.requests || [];

        setCounts({
          equipment: Array.isArray(eqList) ? eqList.length : 0,
          essentialTools: Array.isArray(toolsList) ? toolsList.length : 0,
          maintenanceGuides: Array.isArray(guideList) ? guideList.length : 0,
          plumbingCodes: Array.isArray(codeList) ? codeList.length : 0,
          supportRequests: Array.isArray(suppList) ? suppList.length : (dashData?.totalSupportRequests ?? 0),
        });
      } catch (error) {
        console.error("Dashboard data load failed", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = buildStats(dashData, counts);
  const getUserPhone = (u: DashboardUser) => u.phoneNumber || u.phone || "—";
  const getUserAvatar = (u: DashboardUser) =>
    u.profileimageurl || "/default_profile.png";

  const payloadData = dashData?.data || dashData || {};

  const revenueChartData = {
    labels: payloadData.revenueChart?.labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: payloadData.revenueChart?.data || [0, 0, 0, 0, 0, 0],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const tierChartData = {
    labels: payloadData.tierChart?.labels || ["Free Tier", "Standard Tier", "Premium Tier"],
    datasets: [
      {
        label: "Subscribers",
        data: payloadData.tierChart?.data || [
          payloadData.tierStats?.freemium || 0,
          payloadData.tierStats?.standard || 0,
          payloadData.tierStats?.professional || 0,
        ],
        backgroundColor: ["#94a3b8", "#2563eb", "#ff8400"],
        borderRadius: 6,
      },
    ],
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className='admin-dash' style={{ padding: "24px" }}>
      {/* ── Header ── */}
      <div className='admin-dash-header' style={{ marginBottom: "24px" }}>
        <div>
          <h1 className='admin-dash-title' style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>
            Dashboard Overview
          </h1>
          <p className='admin-dash-sub' style={{ margin: "4px 0 0 0", color: "#64748b" }}>
            Welcome back, <strong>{user?.fullName ?? "Admin"}</strong>
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div
        className='admin-stat-grid'
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {stats.map((s, i) => (
          <Link
            to={s.link}
            className='admin-stat-card'
            key={i}
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: "14px",
            }}
          >
            <div
              className='admin-stat-icon'
              style={{
                background: s.bg,
                borderRadius: "12px",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon icon={s.icon} width={24} color={s.color} />
            </div>
            <div className='admin-stat-body' style={{ flex: 1 }}>
              <p
                className='admin-stat-value'
                style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#0f172a" }}
              >
                {s.value}
              </p>
              <p
                className='admin-stat-label'
                style={{ margin: 0, fontSize: "13px", color: "#64748b" }}
              >
                {s.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Monthly Revenue & User Tier Charts ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        {/* Monthly Revenue Review Chart */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
              Monthly Revenue Review ($)
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
              Subscription revenue trajectory across recent months
            </p>
          </div>
          <div style={{ height: "260px" }}>
            <LineChart chartData={revenueChartData} />
          </div>
        </div>

        {/* User Plan Distribution Chart */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
              User Plan Distribution
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
              Active users grouped by Free, Standard, and Premium plans
            </p>
          </div>
          <div style={{ height: "260px" }}>
            <BarChart chartTitle='' chartData={tierChartData} />
          </div>
        </div>
      </div>

      {/* ── Recent Registered Users Table ── */}
      <div
        className='admin-table-card'
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div
          className='admin-table-head'
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3 className='admin-card-title' style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
              Recent Registered Users
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
              Latest account signups
            </p>
          </div>
          <Link
            to='/admin/users'
            className='admin-view-all'
            style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none", fontSize: "14px" }}
          >
            View All Users →
          </Link>
        </div>
        <div className='admin-table-wrap' style={{ overflowX: "auto" }}>
          <table className='admin-table' style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: "13px", color: "#64748b" }}>
                <th style={{ padding: "12px" }}>#</th>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Phone</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className='admin-table-empty' style={{ padding: "20px", textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px" }}>
                    <td style={{ padding: "12px" }}>{i + 1}</td>
                    <td style={{ padding: "12px" }}>
                      <div className='admin-user-cell' style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          className='admin-user-avatar'
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "#e2e8f0",
                          }}
                        >
                          <img
                            src={getUserAvatar(u)}
                            alt={`${u.firstName || "User"} profile`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.currentTarget.src = "/default_profile.png";
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", color: "#475569" }}>{u.email}</td>
                    <td style={{ padding: "12px", color: "#64748b" }}>{getUserPhone(u)}</td>
                    <td style={{ padding: "12px" }}>
                      <Link
                        to={`/admin/users/update-user/${u._id || u.id}`}
                        className='admin-btn-view'
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#2563eb",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        View Profile
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
