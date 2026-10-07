import React from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionPlans } from "./useSubscriptionPlans";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import delt from "../../assets/images/delete.png";

function SubscriptionPlans() {
  const navigate = useNavigate();
  const {
    plans,
    loading,
    openDeleteDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  } = useSubscriptionPlans();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "freemium":
        return "#6b7280";
      case "standard":
        return "#2563eb";
      case "professional":
        return "#ff8400";
      default:
        return "#4b5563";
    }
  };

  const getTierBadgeBg = (tier: string) => {
    switch (tier) {
      case "freemium":
        return "#f3f4f6";
      case "standard":
        return "#dbeafe";
      case "professional":
        return "#ffedd5";
      default:
        return "#f3f4f6";
    }
  };

  return (
    <div style={{ position: "relative", padding: "24px" }}>
      {loading && <LoadingSpinner />}

      <style>{`
        .plan-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 2px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .plan-card.featured {
          border-color: #ff8400;
        }
        .plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .price-tag {
          font-size: 32px;
          font-weight: 800;
          color: #111827;
        }
        .price-sub {
          font-size: 14px;
          color: #6b7280;
        }
        .plan-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
        .plan-delete-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #fee2e2;
          background-color: #fef2f2;
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .plan-delete-icon-btn:hover {
          background-color: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Subscription Plans & Pricing Tiers
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
            Manage subscription plans, trial settings, and feature access permissions.
          </p>
        </div>
        <div>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/subscription-plans/add")}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "10px 20px",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            <Icon icon="lucide:plus" style={{ marginRight: "8px" }} />
            Add New Subscription Plan
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plan-grid">
        {plans.map((plan) => {
          const isFeatured = plan.tier === "professional";
          const color = getTierColor(plan.tier);
          const badgeBg = getTierBadgeBg(plan.tier);
          const planId = plan._id || plan.id;

          return (
            <div
              key={planId}
              className={`plan-card ${isFeatured ? "featured" : ""}`}
            >
              <div>
                {/* Header Badge & Delete Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        backgroundColor: badgeBg,
                        color: color,
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {plan.tier}
                    </span>

                    {plan.trialDays > 0 && (
                      <span
                        style={{
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {plan.trialDays}-Day Free Trial
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="plan-delete-icon-btn"
                    onClick={() => planId && handleOpenDeleteDialog(planId)}
                    title="Delete Subscription Plan"
                  >
                    <Icon icon="lucide:trash-2" style={{ fontSize: "18px" }} />
                  </button>
                </div>

                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    margin: "0 0 20px 0",
                    color: "#6b7280",
                    fontSize: "14px",
                    minHeight: "40px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Pricing Box */}
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "14px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span className="price-tag">
                      {plan.monthlyPrice === 0 ? "Free" : `$${plan.monthlyPrice}`}
                    </span>
                    {plan.monthlyPrice > 0 && <span className="price-sub">/ month</span>}
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <div style={{ fontSize: "13px", color: "#4b5563", marginTop: "4px" }}>
                      or <strong>${plan.yearlyPrice}</strong> / year (save on annual billing)
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#374151",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                    }}
                  >
                    Included Features:
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {(plan.features || []).map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          marginBottom: "8px",
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        <Icon
                          icon="lucide:check-circle-2"
                          style={{
                            color: color,
                            fontSize: "18px",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() =>
                    navigate(`/admin/subscription-plans/edit/${plan._id || plan.id}`)
                  }
                  style={{
                    backgroundColor: color,
                    color: "#ffffff",
                    borderRadius: "12px",
                    padding: "10px 0",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  <Icon icon="lucide:edit-3" style={{ marginRight: "8px" }} />
                  Edit Plan & Pricing
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            overflowY: "inherit",
            padding: "40px",
            maxWidth: "562px",
          },
        }}
        maxWidth="md"
        fullWidth
        className={dataTable.custommodal}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={dataTable.modalimg} style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={delt} alt="Delete Confirmation" style={{ width: "80px" }} />
        </div>
        <DialogTitle
          id="alert-dialog-title"
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#000",
            fontWeight: "700",
          }}
        >
          {"Delete Subscription Plan"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{
              textAlign: "center",
              color: "#676767",
              fontSize: "16px",
            }}
          >
            {"Are you sure you want to delete this subscription plan? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          <Button
            onClick={handleCloseDeleteDialog}
            className="btn-cancel"
            style={{ border: "1px solid #ccc", borderRadius: "20px", padding: "8px 25px", textTransform: "none", color: "#666" }}
          >
            {"Cancel"}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            className="btn"
            style={{ background: "#EF4444", color: "#fff", borderRadius: "20px", padding: "8px 25px", textTransform: "none" }}
          >
            {"Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRole(SubscriptionPlans, ["admin"]);
