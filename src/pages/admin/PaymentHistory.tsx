import React, { useEffect, useState, useMemo } from "react";
import withRole from "../withRole";
import { dashboardApi } from "../../service/apis/auth.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
  Button,
} from "@mui/material";
import dataTable from "../../components/tables/customTable/datatable.module.scss";

type TransactionItem = {
  _id?: string;
  id?: string;
  orderId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  tier?: string;
  status?: string;
  createdAt?: string;
  startDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  userId?: {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    role?: string;
    profileimageurl?: string;
    subscriptionTier?: string;
  };
  planId?: {
    _id?: string;
    id?: string;
    name?: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    tier?: string;
    description?: string;
    features?: string[];
    accessibleFeatures?: { key: string; label: string; enabled: boolean }[];
    trialDays?: number;
  };
};

function PaymentHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
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

  /**
   * Format Order ID to ensure ORD- is followed by 5 alphanumeric characters
   */
  const formatOrderId = (tx: TransactionItem): string => {
    if (tx.orderId && tx.orderId.trim()) {
      const trimmed = tx.orderId.trim().toUpperCase();
      if (trimmed.startsWith("ORD-")) {
        const after = trimmed.slice(4);
        return `ORD-${after.substring(0, 5)}`;
      }
      const cleaned = trimmed.replace(/[^0-9A-Z]/g, "");
      return `ORD-${cleaned.substring(0, 5)}`;
    }
    const fallbackId = String(tx._id || tx.id || "").replace(/[^0-9a-zA-Z]/g, "").toUpperCase();
    const five = fallbackId.length >= 5 ? fallbackId.substring(0, 5) : fallbackId.padEnd(5, "X");
    return `ORD-${five}`;
  };

  /**
   * Helper to check if payment is recurring or one-time
   */
  const getPaymentType = (tx: TransactionItem): { type: "Recurring" | "One-Time"; color: string; bg: string; icon: string } => {
    const subId = (tx.stripeSubscriptionId || "").trim();
    const planName = (tx.planId?.name || "").toLowerCase();
    const isExplicitOneTime = planName.includes("one-time") || planName.includes("onetime");

    if (
      !isExplicitOneTime &&
      (subId.startsWith("sub_") ||
        planName.includes("recurring") ||
        planName.includes("/day") ||
        planName.includes("/month") ||
        planName.includes("/year") ||
        tx.currentPeriodEnd ||
        tx.tier === "professional" ||
        tx.tier === "standard")
    ) {
      return {
        type: "Recurring",
        color: "#2563eb",
        bg: "#eff6ff",
        icon: "ph:arrows-clockwise-bold",
      };
    }

    return {
      type: "One-Time",
      color: "#059669",
      bg: "#ecfdf5",
      icon: "ph:lightning-bold",
    };
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let recurringCount = 0;
    let oneTimeCount = 0;
    let successfulCount = 0;

    rawTransactions.forEach((tx) => {
      const tierName = tx.tier || tx.planId?.tier || "standard";
      const price = tx.planId?.monthlyPrice ?? (tierName === "professional" || tierName === "premium" ? 19.99 : tierName === "standard" ? 7.99 : 0);
      const isPaid = (tx.status || "active").toLowerCase() === "active" || (tx.status || "").toLowerCase() === "paid";
      if (isPaid) {
        totalRevenue += price;
        successfulCount++;
      }

      const pType = getPaymentType(tx);
      if (pType.type === "Recurring") recurringCount++;
      else oneTimeCount++;
    });

    return {
      totalRevenue,
      recurringCount,
      oneTimeCount,
      successfulCount,
      totalCount: rawTransactions.length,
    };
  }, [rawTransactions]);

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
      const pType = getPaymentType(tx);

      // Tier filter
      let matchesTier = true;
      if (tierFilter === "canceled") matchesTier = status === "canceled";
      else if (tierFilter === "standard") matchesTier = tier === "standard";
      else if (tierFilter === "professional") matchesTier = tier === "professional" || tier === "premium";

      if (!matchesTier) return false;

      // Type filter
      if (typeFilter !== "all" && pType.type !== typeFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const orderId = (formatOrderId(tx) || tx.orderId || "").toLowerCase();
      const custId = (tx.stripeCustomerId || "").toLowerCase();
      const userName = getUserDisplayName(tx.userId).toLowerCase();
      const userEmail = (tx.userId?.email || "").toLowerCase();
      const planName = (tx.planId?.name || "").toLowerCase();

      return (
        orderId.includes(q) ||
        custId.includes(q) ||
        userName.includes(q) ||
        userEmail.includes(q) ||
        planName.includes(q)
      );
    });
  }, [rawTransactions, tierFilter, typeFilter, searchQuery]);

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
            color: "#059669",
            border: "1px solid #a7f3d0",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 700,
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
            color: "#dc2626",
            border: "1px solid #fecaca",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 700,
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
          color: "#d97706",
          border: "1px solid #fde68a",
          padding: "5px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b" }} />
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <div className={dataTable.datatablemainwrap}>
        {/* Header Section */}
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
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Payment History
          </h2>
        </div>

        {/* Filter & Search Control Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {/* Search Input matching Users.tsx */}
          <div style={{ position: "relative", flex: 1, minWidth: "240px" }}>
            <Icon
              icon='fluent:search-28-filled'
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                color: "#9CA3AF",
                pointerEvents: "none",
              }}
            />
            <input
              type='text'
              placeholder='Search by Order ID, Customer, or Plan...'
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                padding: "8px 36px 8px 40px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                height: "46px",
                width: "100%",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                type='button'
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Tier & Status Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
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
                    padding: "0 16px",
                    height: "46px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    border: active ? "1px solid var(--gc-primary, #335AFF)" : "1px solid #E5E7EB",
                    backgroundColor: active ? "var(--gc-primary, #335AFF)" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#4B5563",
                    boxShadow: active ? "0 2px 6px rgba(51, 90, 255, 0.2)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions Table matching standard Admin UI */}
        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='payment history table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align='left' style={{ whiteSpace: "nowrap" }}>Order ID</TableCell>
                  <TableCell align='left'>Customer</TableCell>
                  <TableCell align='left'>Plan</TableCell>
                  <TableCell align='left'>Type</TableCell>
                  <TableCell align='left'>Amount</TableCell>
                  <TableCell align='left'>Date</TableCell>
                  <TableCell align='left'>Status</TableCell>
                  <TableCell align='center'>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center' style={{ padding: "40px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <Icon icon="ph:receipt-x-bold" width={36} color="#9CA3AF" />
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#6B7280" }}>
                          No payment records found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((tx, i) => {
                    const txIdentifier = tx._id || tx.id || tx.orderId || "";
                    const u = tx.userId;
                    const displayName = getUserDisplayName(u);
                    const tierName = tx.tier || tx.planId?.tier || "standard";
                    const price = tx.planId?.monthlyPrice ?? (tierName === "professional" || tierName === "premium" ? 19.99 : tierName === "standard" ? 7.99 : 0);
                    const dateStr = tx.createdAt || tx.startDate ? new Date(tx.createdAt || tx.startDate!).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
                    const pType = getPaymentType(tx);

                    return (
                      <TableRow
                        key={txIdentifier || i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* Order ID */}
                        <TableCell align='left' style={{ whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: "13px",
                              whiteSpace: "nowrap",
                              display: "inline-block",
                              fontFamily: "monospace",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {formatOrderId(tx)}
                          </span>
                        </TableCell>

                        {/* Customer */}
                        <TableCell align='left'>
                          <div
                            className='admin-user-cell'
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              className='admin-user-avatar'
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                flexShrink: 0,
                                background: "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                color: "#4B5563",
                              }}
                            >
                              {u?.profileimageurl ? (
                                <img
                                  src={u.profileimageurl}
                                  alt='Avatar'
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
                              <div style={{ fontWeight: "bold", color: "#111827" }}>
                                {displayName}
                              </div>
                              <span style={{ fontSize: "11px", color: "#6B7280" }}>
                                {u?.email || "—"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Plan */}
                        <TableCell align='left'>
                          <div>
                            <div style={{ fontWeight: 600, color: "#111827" }}>
                              {tx.planId?.name || `${tierName.charAt(0).toUpperCase() + tierName.slice(1)} Plan`}
                            </div>
                            <span style={{ fontSize: "11px", color: "#6B7280", textTransform: "capitalize" }}>
                              Tier: {tierName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Type */}
                        <TableCell align='left'>
                          <span
                            style={{
                              backgroundColor: pType.bg,
                              color: pType.color,
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Icon icon={pType.icon} width={13} />
                            {pType.type}
                          </span>
                        </TableCell>

                        {/* Amount */}
                        <TableCell align='left'>
                          <span style={{ fontWeight: 700, color: "#111827" }}>
                            ${price.toFixed(2)}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell align='left' style={{ color: "#4B5563", fontSize: "13px" }}>
                          {dateStr}
                        </TableCell>

                        {/* Status */}
                        <TableCell align='left'>
                          {renderStatusBadge(tx.status)}
                        </TableCell>

                        {/* Action */}
                        <TableCell align='center'>
                          <button
                            type="button"
                            onClick={() => {
                              if (txIdentifier) {
                                navigate(`/admin/payment-history/${txIdentifier}`);
                              }
                            }}
                            style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              backgroundColor: "var(--gc-primary, #335AFF)",
                              color: "#fff",
                              borderRadius: "8px",
                              border: "none",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              height: "32px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <Icon icon="ph:eye-bold" style={{ fontSize: "14px" }} />
                            <span>View</span>
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              Showing <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</strong> of <strong>{filteredTransactions.length}</strong> transactions
            </div>

            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                shape='rounded'
                color='primary'
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRole(PaymentHistory, ["admin"]);

