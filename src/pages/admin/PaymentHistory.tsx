import { useEffect, useState, useMemo } from "react";
import withRole from "../withRole";
import { dashboardApi } from "../../service/apis/auth.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

type TransactionItem = {
  _id?: string;
  orderId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  tier?: string;
  status?: string;
  createdAt?: string;
  startDate?: string;
  userId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    profileimageurl?: string;
    subscriptionTier?: string;
  };
  planId?: {
    _id?: string;
    name?: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    tier?: string;
  };
};

function PaymentHistory() {
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi({});
        if (res?.status === 200) {
          setDashData(res.data || res);
        }
      } catch (err) {
        console.error("Failed to load payment history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const payload = dashData?.data || dashData || {};
  const rawTransactions: TransactionItem[] = payload.recentTransactions || [];

  const getUserDisplayName = (u?: TransactionItem["userId"]) => {
    if (!u) return "Unknown User";
    if (u.fullName && u.fullName.trim()) return u.fullName;
    const constructed = [u.firstName, u.lastName].filter(Boolean).join(" ");
    if (constructed.trim()) return constructed;
    return u.email?.split("@")[0] || "User";
  };

  const handleFilterChange = (filter: string) => {
    setTierFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((tx) => {
      const tier = (tx.tier || tx.planId?.tier || "standard").toLowerCase();
      const status = (tx.status || "active").toLowerCase();

      let matchesTier = true;
      if (tierFilter === "canceled") matchesTier = status === "canceled";
      else if (tierFilter === "freemium") matchesTier = tier === "freemium";
      else if (tierFilter === "standard") matchesTier = tier === "standard";
      else if (tierFilter === "professional") matchesTier = tier === "professional" || tier === "premium";

      if (!matchesTier) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const orderId = (tx.orderId || "").toLowerCase();
      const custId = (tx.stripeCustomerId || "").toLowerCase();
      const userName = getUserDisplayName(tx.userId).toLowerCase();
      const userEmail = (tx.userId?.email || "").toLowerCase();

      return orderId.includes(q) || custId.includes(q) || userName.includes(q) || userEmail.includes(q);
    });
  }, [rawTransactions, tierFilter, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const renderStatusBadge = (status?: string) => {
    const s = (status || "active").toLowerCase();
    if (s === "active" || s === "paid" || s === "succeeded") {
      return (
        <span
          style={{
            backgroundColor: "#ecfdf5",
            color: "#047857",
            border: "1px solid #a7f3d0",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
          Paid / Active
        </span>
      );
    }
    if (s === "canceled" || s === "failed") {
      return (
        <span
          style={{
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
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
          {s === "canceled" ? "Canceled" : "Failed"}
        </span>
      );
    }
    return (
      <span
        style={{
          backgroundColor: "#fffbeb",
          color: "#b45309",
          border: "1px solid #fde68a",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b" }} />
        {s}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: "32px 24px", width: "100%", boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ background: "#e0e7ff", padding: "8px", borderRadius: "10px", display: "flex", color: "#4f46e5" }}>
              <Icon icon="ph:credit-card-bold" width={24} />
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
              Payment History
            </h1>
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Audit log of completed transactions, Stripe order IDs, billing amounts, and subscription statuses.
          </p>
        </div>
      </div>

      {/* ── Payment History Data Table Card ── */}
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
          <div style={{ position: "relative", minWidth: "280px", flex: "1 max-content" }}>
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
              placeholder="Search by Order ID, customer, email..."
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
              { label: `All (${rawTransactions.length})`, value: "all" },
              { label: `Standard`, value: "standard" },
              { label: `Premium`, value: "professional" },
              { label: `Canceled`, value: "canceled" },
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

        {/* Payment History Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", borderRadius: "8px 0 0 8px" }}>Order / Tx ID</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Customer</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Plan / Tier</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Amount</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Date</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>Status</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0", textAlign: "right", borderRadius: "0 8px 8px 0" }}>User Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px 24px", textAlign: "center", color: "#94a3b8" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <Icon icon="ph:receipt-x-bold" width={36} color="#cbd5e1" />
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>No payment transactions recorded yet matching your filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx, i) => {
                  const u = tx.userId;
                  const displayName = getUserDisplayName(u);
                  const tierName = tx.tier || tx.planId?.tier || "standard";
                  const price = tx.planId?.monthlyPrice ?? (tierName === "professional" || tierName === "premium" ? 19.99 : tierName === "standard" ? 7.99 : 0);
                  const dateStr = tx.createdAt || tx.startDate ? new Date(tx.createdAt || tx.startDate!).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

                  return (
                    <tr key={tx._id || i} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                          {tx.orderId || `ORD-${tx._id?.substring(0, 8)}`}
                        </div>
                        {tx.stripeSubscriptionId && (
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                            Sub: {tx.stripeSubscriptionId}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: "#e2e8f0",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              color: "#475569",
                              fontSize: "13px",
                            }}
                          >
                            {u?.profileimageurl ? (
                              <img
                                src={u.profileimageurl}
                                alt={`${displayName} profile`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                            ) : (
                              displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>{displayName}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{u?.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ textTransform: "capitalize", fontWeight: 600, color: "#334155" }}>
                          {tx.planId?.name || `${tierName} Plan`}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a" }}>
                        ${price.toFixed(2)}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#64748b" }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {renderStatusBadge(tx.status)}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        {u?._id ? (
                          <Link
                            to={`/admin/users/update-user/${u._id}`}
                            style={{
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>View User</span>
                            <Icon icon="ph:arrow-right-bold" width={12} />
                          </Link>
                        ) : (
                          <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Controls ── */}
        {filteredTransactions.length > 0 && (
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
                {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}
              </strong>{" "}
              of <strong style={{ color: "#0f172a" }}>{filteredTransactions.length}</strong> entries
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

export default withRole(PaymentHistory, ["admin"]);
