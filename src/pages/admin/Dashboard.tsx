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
      label: "Support Request",
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className='admin-dash'>
      {/* ── Header ── */}
      <div className='admin-dash-header'>
        <div>
          <h1 className='admin-dash-title'>Dashboard</h1>
          <p className='admin-dash-sub'>
            Welcome back, <strong>{user?.fullName ?? "Admin"}</strong>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className='admin-table-empty'>
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

