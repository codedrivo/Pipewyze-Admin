import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import withRole from "../withRole";
import { getTransactionDetailsApi } from "../../service/apis/auth.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { Icon } from "@iconify/react";
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

function PaymentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<TransactionItem | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id || id === "undefined") {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getTransactionDetailsApi(id);
        if (res?.status === 200) {
          setTx(res.data);
        }
      } catch (err) {
        console.error("Failed to load transaction details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const getPaymentType = (t: TransactionItem) => {
    const subId = (t.stripeSubscriptionId || "").trim();
    const planName = (t.planId?.name || "").toLowerCase();

    if (
      subId.startsWith("sub_") ||
      planName.includes("recurring") ||
      planName.includes("/day") ||
      planName.includes("/month") ||
      planName.includes("/year")
    ) {
      return {
        type: "Recurring Payment",
        color: "#2563eb",
        bg: "#eff6ff",
        icon: "ph:arrows-clockwise-bold",
        desc: "Automated recurring subscription cycle via Stripe.",
      };
    }

    return {
      type: "One-Time Payment",
      color: "#059669",
      bg: "#ecfdf5",
      icon: "ph:lightning-bold",
      desc: "One-time checkout fee charged directly.",
    };
  };

  const getUserDisplayName = (u?: TransactionItem["userId"]) => {
    if (!u) return "Unknown User";
    if (u.fullName && u.fullName.trim()) return u.fullName;
    const constructed = [u.firstName, u.lastName].filter(Boolean).join(" ");
    if (constructed.trim()) return constructed;
    return u.email?.split("@")[0] || "User";
  };

  const renderStatusBadge = (status?: string) => {
    const s = (status || "active").toLowerCase();
    if (s === "active" || s === "paid" || s === "succeeded") {
      return (
        <span
          style={{
            backgroundColor: "#ecfdf5",
            color: "#059669",
            border: "1px solid #a7f3d0",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
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
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "13px",
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
          padding: "5px 14px",
          borderRadius: "20px",
          fontSize: "13px",
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

  if (loading) return <LoadingSpinner />;

  if (!tx) {
    return (
      <div style={{ position: "relative" }} className='dsp'>
        <div className={dataTable.datatablemainwrap} style={{ textAlign: "center", padding: "60px 20px" }}>
          <Icon icon="ph:receipt-x-bold" width={56} color="#9ca3af" />
          <h2 style={{ color: "#111827", marginTop: "16px", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}>
            Transaction Not Found
          </h2>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "6px 0 20px" }}>
            The requested payment details could not be found or have expired.
          </p>
          <button
            onClick={() => navigate("/admin/payment-history")}
            className='custom-button w-auto sm'
            style={{ margin: "0 auto", padding: "0 24px" }}
          >
            Back to Payment History
          </button>
        </div>
      </div>
    );
  }

  const pType = getPaymentType(tx);
  const u = tx.userId;
  const plan = tx.planId;
  const displayName = getUserDisplayName(u);
  const tierName = tx.tier || plan?.tier || "standard";
  const amount = plan?.monthlyPrice ?? (tierName === "professional" ? 19.99 : 7.99);

  return (
    <div style={{ position: "relative" }} className='dsp'>
      <style>{`
        .pd-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          padding: 24px;
        }
        .pd-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .pd-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .pd-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background-color: #f9fafb;
          border-radius: 8px;
          font-size: 13px;
        }
        .pd-row-label {
          color: #6b7280;
          font-weight: 500;
        }
        .pd-row-value {
          color: #111827;
          font-weight: 700;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header Section matching other Admin Pages */}
        <div
          className='gc-profile-flex'
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
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
              Payment & Plan Details
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
              Order: <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e3a8a" }}>{tx.orderId || `ORD-${String(tx._id || tx.id || "").substring(0, 8)}`}</span>
            </p>
          </div>

          <button
            type='button'
            onClick={() => navigate("/admin/payment-history")}
            className='custom-button gc-back-btn mtop-0'
            style={{
              margin: 0,
              width: "auto",
              height: "42px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0 20px",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            <Icon icon='mdi:arrow-left' style={{ fontSize: "20px" }} />
            <span>Back to Payment History</span>
          </button>
        </div>

        {/* ── Summary Highlight Card ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: pType.bg,
                  color: pType.color,
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <Icon icon={pType.icon} width={15} />
                {pType.type}
              </span>
              <span style={{ color: "#9ca3af" }}>•</span>
              <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>
                {tx.createdAt ? new Date(tx.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—"}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>
              {plan?.name || `${tierName} Plan`}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>
              {pType.desc}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "4px" }}>
              Amount Billed
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
              ${amount.toFixed(2)}
            </div>
            <div style={{ marginTop: "10px" }}>{renderStatusBadge(tx.status)}</div>
          </div>
        </div>

        {/* ── Two Column Details Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "24px" }}>
          {/* Customer Card */}
          <div className="pd-card">
            <div className="pd-card-header">
              <div className="pd-icon-badge" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                <Icon icon="ph:user-circle-bold" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
                  Customer Information
                </h3>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Subscriber profile & contact details</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#4b5563",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {u?.profileimageurl ? (
                  <img src={u.profileimageurl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>{displayName}</div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>{u?.email || "No email"}</div>
                <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600, textTransform: "capitalize", marginTop: "2px" }}>
                  Account Role: {u?.role || "home-owner"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="pd-row">
                <span className="pd-row-label">Phone Number</span>
                <span className="pd-row-value">{u?.phone || "—"}</span>
              </div>
              <div className="pd-row">
                <span className="pd-row-label">Subscription Tier</span>
                <span className="pd-row-value" style={{ textTransform: "capitalize" }}>{u?.subscriptionTier || "freemium"}</span>
              </div>
              <div className="pd-row">
                <span className="pd-row-label">User ID</span>
                <span className="pd-row-value" style={{ fontFamily: "monospace", fontSize: "12px" }}>{u?._id || u?.id || "—"}</span>
              </div>
            </div>
          </div>

          {/* Plan Card */}
          <div className="pd-card">
            <div className="pd-card-header">
              <div className="pd-icon-badge" style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
                <Icon icon="ph:sparkle-bold" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
                  Plan Specifications
                </h3>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Features, limits, and rates</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="pd-row">
                <span className="pd-row-label">Plan Name</span>
                <span className="pd-row-value">{plan?.name || `${tierName} Plan`}</span>
              </div>
              <div className="pd-row">
                <span className="pd-row-label">Tier Category</span>
                <span className="pd-row-value" style={{ textTransform: "capitalize" }}>{plan?.tier || tierName}</span>
              </div>
              <div className="pd-row">
                <span className="pd-row-label">Monthly Rate</span>
                <span className="pd-row-value">${plan?.monthlyPrice?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="pd-row">
                <span className="pd-row-label">Yearly Rate</span>
                <span className="pd-row-value">${plan?.yearlyPrice?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            {plan?.description && (
              <p style={{ margin: "14px 0 0", fontSize: "13px", color: "#4b5563", backgroundColor: "#f9fafb", padding: "10px 14px", borderRadius: "8px", border: "1px solid #f3f4f6" }}>
                {plan.description}
              </p>
            )}

            {plan?.accessibleFeatures && plan.accessibleFeatures.length > 0 && (
              <div style={{ marginTop: "14px" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>Included Permissions:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                  {plan.accessibleFeatures.map((f, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: "6px",
                        backgroundColor: f.enabled ? "#ecfdf5" : "#f3f4f6",
                        color: f.enabled ? "#059669" : "#9ca3af",
                        border: `1px solid ${f.enabled ? "#a7f3d0" : "#e5e7eb"}`,
                      }}
                    >
                      {f.enabled ? "✓" : "✕"} {f.label || f.key}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stripe Gateway & Audit Details ── */}
        <div className="pd-card">
          <div className="pd-card-header">
            <div className="pd-icon-badge" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
              <Icon icon="ph:receipt-bold" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
                Stripe Gateway & Tracking
              </h3>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Payment gateway synchronization records</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            <div className="pd-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
              <span className="pd-row-label">Stripe Reference ID</span>
              <span className="pd-row-value" style={{ fontFamily: "monospace", fontSize: "13px", wordBreak: "break-all" }}>
                {tx.stripeSubscriptionId || "—"}
              </span>
            </div>

            <div className="pd-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
              <span className="pd-row-label">Stripe Customer ID</span>
              <span className="pd-row-value" style={{ fontFamily: "monospace", fontSize: "13px", wordBreak: "break-all" }}>
                {tx.stripeCustomerId || "—"}
              </span>
            </div>

            <div className="pd-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
              <span className="pd-row-label">Internal Order Number</span>
              <span className="pd-row-value" style={{ fontFamily: "monospace", fontSize: "13px" }}>
                {tx.orderId || `ORD-${String(tx._id || tx.id || "").substring(0, 8)}`}
              </span>
            </div>

            <div className="pd-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
              <span className="pd-row-label">Active Period</span>
              <span className="pd-row-value" style={{ fontSize: "13px" }}>
                {tx.startDate || tx.createdAt ? new Date(tx.startDate || tx.createdAt!).toLocaleDateString() : "—"}
                {tx.currentPeriodEnd ? ` → ${new Date(tx.currentPeriodEnd).toLocaleDateString()}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRole(PaymentDetails, ["admin"]);
