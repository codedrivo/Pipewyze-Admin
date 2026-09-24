import { useEffect, useState, useMemo } from "react";
import withRole from "../withRole";
import { dashboardApi } from "../../service/apis/auth.api";
import { userApi } from "../../service/apis/user.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type UserItem = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  profileimageurl?: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  createdAt?: string;
};

function Transactions() {
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, userRes] = await Promise.all([
          dashboardApi({}),
          userApi({ currentPage: 1, limit: 100 }),
        ]);

        if (dashRes?.status === 200) {
          setDashData(dashRes.data || dashRes);
        }

        if (userRes?.status === 200) {
          const rawUsers =
            userRes.users?.users || userRes.data?.users || userRes.users || [];
          setAllUsers(rawUsers);
        }
      } catch (err) {
        console.error("Failed to load transaction data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const payload = dashData?.data || dashData || {};
  const tierStats = payload.tierStats || { freemium: 0, standard: 0, professional: 0 };

  const canceledCount = useMemo(() => {
    return allUsers.filter(
      (u) => (u.subscriptionStatus || "").toLowerCase() === "canceled"
    ).length;
  }, [allUsers]);

  const handleFilterChange = (filter: string) => {
    setTierFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getUserDisplayName = (u: UserItem) => {
    if (u.fullName && u.fullName.trim()) return u.fullName;
    const constructed = [u.firstName, u.lastName].filter(Boolean).join(" ");
    if (constructed.trim()) return constructed;
    return u.email?.split("@")[0] || "User";
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const userTier = (u.subscriptionTier || "freemium").toLowerCase();
      const status = (u.subscriptionStatus || "").toLowerCase();

      // Filter by tier status
      let matchesTier = true;
      if (tierFilter === "canceled") matchesTier = status === "canceled" || userTier === "canceled";
      else if (tierFilter === "freemium") matchesTier = userTier === "freemium" && status !== "canceled";
      else if (tierFilter === "standard") matchesTier = userTier === "standard" && status !== "canceled";
      else if (tierFilter === "professional")
        matchesTier = (userTier === "professional" || userTier === "premium") && status !== "canceled";

      if (!matchesTier) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = getUserDisplayName(u).toLowerCase();
      const email = (u.email || "").toLowerCase();
      const phone = (u.phoneNumber || u.phone || "").toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [allUsers, tierFilter, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const renderTierBadge = (user: UserItem) => {
    const status = (user.subscriptionStatus || "").toLowerCase();
    if (status === "canceled") {
      return (
        <span
          style={{
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }} />
          Canceled
        </span>
      );
    }

    const t = (user.subscriptionTier || "freemium").toLowerCase();
    switch (t) {
      case "standard":
        return (
          <span
            style={{
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" }} />
            Standard ($7.99/mo)
          </span>
        );
      case "professional":
      case "premium":
        return (
          <span
            style={{
              backgroundColor: "#fff7ed",
              color: "#c2410c",
              border: "1px solid #fed7aa",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f97316" }} />
            Premium ($19.99/mo)
          </span>
        );
      default:
        return (
          <span
            style={{
              backgroundColor: "#f8fafc",
              color: "#475569",
              border: "1px solid #e2e8f0",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#94a3b8" }} />
            Free Tier
          </span>
        );
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: "32px 24px", width: "100%", boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ background: "#e0e7ff", padding: "8px", borderRadius: "10px", display: "flex", color: "#4f46e5" }}>
              <Icon icon="ph:receipt-bold" width={24} />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "26px",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              User Plan Tiers & Transactions
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Monitor subscription tiers, billing status, and member directory details across your platform.
          </p>
        </div>
      </div>

      {/* ── Summary Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          onClick={() => handleFilterChange("freemium")}
          style={{
            background: tierFilter === "freemium" ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" : "#ffffff",
            borderRadius: "14px",
            padding: "20px",
            border: tierFilter === "freemium" ? "2px solid #64748b" : "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#475569",
            }}
          >
            <Icon icon="ph:user-bold" width={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
              {tierStats.freemium}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
              Free Users
            </p>
          </div>
        </div>

        <div
          onClick={() => handleFilterChange("standard")}
          style={{
            background: tierFilter === "standard" ? "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)" : "#ffffff",
            borderRadius: "14px",
            padding: "20px",
            border: tierFilter === "standard" ? "2px solid #2563eb" : "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              background: "#dbeafe",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1d4ed8",
            }}
          >
            <Icon icon="ph:star-bold" width={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
              {tierStats.standard}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
              Standard ($7.99)
            </p>
          </div>
        </div>

        <div
          onClick={() => handleFilterChange("professional")}
          style={{
            background: tierFilter === "professional" ? "linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)" : "#ffffff",
            borderRadius: "14px",
            padding: "20px",
            border: tierFilter === "professional" ? "2px solid #ea580c" : "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              background: "#ffedd5",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c2410c",
            }}
          >
            <Icon icon="ph:crown-bold" width={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
              {tierStats.professional}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
              Premium ($19.99)
            </p>
          </div>
        </div>

        <div
          onClick={() => handleFilterChange("canceled")}
          style={{
            background: tierFilter === "canceled" ? "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)" : "#ffffff",
            borderRadius: "14px",
            padding: "20px",
            border: tierFilter === "canceled" ? "2px solid #dc2626" : "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              background: "#fee2e2",
              borderRadius: "12px",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dc2626",
            }}
          >
            <Icon icon="ph:x-circle-bold" width={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
              {canceledCount}
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", fontWeight: 500, color: "#64748b" }}>
              Canceled Users
            </p>
          </div>
        </div>
      </div>

      {/* ── User Plan Tiers Directory Card ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Card Header & Search / Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "260px", flex: "1 max-content" }}>
            <Icon
              icon="ph:magnifying-glass-bold"
              width={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "8px 12px 8px 38px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
                color: "#0f172a",
                backgroundColor: "#f8fafc",
                boxSizing: "border-box",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                <Icon icon="ph:x-bold" width={14} />
              </button>
            )}
          </div>

          {/* Tier Filter Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { label: `All (${allUsers.length})`, value: "all" },
              { label: `Free (${tierStats.freemium})`, value: "freemium" },
              { label: `Standard (${tierStats.standard})`, value: "standard" },
              { label: `Premium (${tierStats.professional})`, value: "professional" },
              { label: `Canceled (${canceledCount})`, value: "canceled" },
            ].map((tab) => {
              const active = tierFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleFilterChange(tab.value)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    border: active ? "1px solid #2563eb" : "1px solid #e2e8f0",
                    backgroundColor: active ? "#2563eb" : "#ffffff",
                    color: active ? "#ffffff" : "#475569",
                    transition: "all 0.15s ease",
                    boxShadow: active ? "0 2px 6px rgba(37, 99, 235, 0.25)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", borderRadius: "8px 0 0 8px" }}>#</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>User</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Email</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Phone</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Plan Tier</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "right", borderRadius: "0 8px 8px 0" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <Icon icon="ph:user-minus-bold" width={32} color="#cbd5e1" />
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>No users found matching your filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, i) => {
                  const displayName = getUserDisplayName(u);
                  return (
                    <tr
                      key={u._id || u.id || i}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "14px",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "14px 16px", color: "#94a3b8", fontWeight: 500 }}>
                        {startIndex + i + 1}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: "#e2e8f0",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              color: "#475569",
                              fontSize: "14px",
                            }}
                          >
                            {u.profileimageurl ? (
                              <img
                                src={u.profileimageurl}
                                alt={`${displayName} profile`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>
                              {displayName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#334155" }}>{u.email || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#64748b" }}>
                        {u.phoneNumber || u.phone || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {renderTierBadge(u)}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <Link
                          to={`/admin/users/update-user/${u._id || u.id}`}
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#2563eb",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span>View User</span>
                          <Icon icon="ph:arrow-right-bold" width={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Controls ── */}
        {filteredUsers.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid #f1f5f9",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              Showing <strong style={{ color: "#0f172a" }}>{startIndex + 1}</strong> to{" "}
              <strong style={{ color: "#0f172a" }}>
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
              </strong>{" "}
              of <strong style={{ color: "#0f172a" }}>{filteredUsers.length}</strong> entries
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: currentPage === 1 ? "#f8fafc" : "#ffffff",
                  color: currentPage === 1 ? "#cbd5e1" : "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor:
                        currentPage === pageNum ? "#2563eb" : "#cbd5e1",
                      backgroundColor:
                        currentPage === pageNum ? "#2563eb" : "#ffffff",
                      color: currentPage === pageNum ? "#ffffff" : "#334155",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor:
                    currentPage === totalPages ? "#f8fafc" : "#ffffff",
                  color: currentPage === totalPages ? "#cbd5e1" : "#334155",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRole(Transactions, ["admin"]);

