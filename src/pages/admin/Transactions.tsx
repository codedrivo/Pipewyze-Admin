import { useEffect, useState, useMemo } from "react";
import withRole from "../withRole";
import { dashboardApi } from "../../service/apis/auth.api";
import { userApi } from "../../service/apis/user.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { Icon } from "@iconify/react";
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
} from "@mui/material";
import dataTable from "../../components/tables/customTable/datatable.module.scss";

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
  activePlan?: {
    name?: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    tier?: string;
  } | null;
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
    const plan = user.activePlan;
    const planPrice = plan?.monthlyPrice;
    const priceText = typeof planPrice === "number" ? `$${planPrice.toFixed(2)}` : null;

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
            {plan?.name ? `${plan.name} (${priceText || "$7.99"})` : `Standard (${priceText || "$7.99"})`}
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
            {plan?.name ? `${plan.name} (${priceText || "$19.99"})` : `Premium (${priceText || "$19.99"})`}
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
    <div style={{ position: "relative" }} className='dsp'>
      <style>{`
        .searchgrp-full {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          height: 46px;
          flex: 1;
          min-width: 240px;
          padding: 0 14px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .searchgrp-full input {
          border: none !important;
          outline: none !important;
          width: 100%;
          height: 100% !important;
          margin-left: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif !important;
          background: transparent !important;
          color: #111827;
          padding: 0 !important;
        }
        .stat-badge-tab {
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header Section */}
        <div
          className='gc-profile-flex'
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              User Plan Tiers & Transactions
            </h2>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
              Monitor user subscription tiers, directory status, and member accounts.
            </p>
          </div>
        </div>

        {/* Search & Filter Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {/* Search Box */}
          <div className="searchgrp-full">
            <Icon icon="fluent:search-28-filled" style={{ color: "#9ca3af", fontSize: "18px" }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Tier Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
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
                  className="stat-badge-tab"
                  style={{
                    border: active ? "1px solid var(--gc-primary, #335AFF)" : "1px solid #E5E7EB",
                    backgroundColor: active ? "var(--gc-primary, #335AFF)" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#4B5563",
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? "0 2px 6px rgba(51, 90, 255, 0.25)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Table */}
        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 900 }}
              aria-label='users transaction directory table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align='left'>#</TableCell>
                  <TableCell align='left'>User</TableCell>
                  <TableCell align='left'>Email</TableCell>
                  <TableCell align='left'>Phone</TableCell>
                  <TableCell align='center'>Plan Tier</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align='center' style={{ padding: "40px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <Icon icon="ph:user-minus-bold" width={32} color="#cbd5e1" />
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#6b7280" }}>
                          No users found matching your filter criteria.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((u, i) => {
                    const displayName = getUserDisplayName(u);
                    return (
                      <TableRow
                        key={u._id || u.id || i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align='left' style={{ color: "#9ca3af", fontWeight: 600 }}>
                          {startIndex + i + 1}
                        </TableCell>

                        <TableCell align='left'>
                          <div
                            className='admin-user-cell'
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              className='admin-user-avatar'
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                background: "#f3f4f6",
                                border: "1px solid #e5e7eb",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                color: "#4b5563",
                                fontSize: "14px",
                              }}
                            >
                              {u.profileimageurl ? (
                                <img
                                  src={u.profileimageurl}
                                  alt={displayName}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                displayName.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div style={{ fontWeight: 600, color: "#111827", fontSize: "14px" }}>
                              {displayName}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell align='left' style={{ color: "#374151" }}>
                          {u.email || "—"}
                        </TableCell>

                        <TableCell align='left' style={{ color: "#6b7280" }}>
                          {u.phoneNumber || u.phone || "—"}
                        </TableCell>

                        <TableCell align='center'>
                          {renderTierBadge(u)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination Controls */}
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
              Showing <strong>{startIndex + 1}</strong> to{" "}
              <strong>{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</strong> of{" "}
              <strong>{filteredUsers.length}</strong> users
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

export default withRole(Transactions, ["admin"]);

