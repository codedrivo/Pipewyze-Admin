import React from "react";
import { useAddSubscriptionPlan } from "./useAddSubscriptionPlan";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import withRole from "../withRole";

function AddSubscriptionPlan() {
  const {
    navigate,
    formik,
    saving,
    accessibleFeatures,
    toggleFeature,
    addCustomFeature,
    removeFeature,
    customKey,
    setCustomKey,
    customLabel,
    setCustomLabel,
    availableCatalogFeatures,
    selectedCatalogKey,
    setSelectedCatalogKey,
    addSelectedFeatureFromDropdown,
  } = useAddSubscriptionPlan();

  const applyFormatting = (tag: "b" | "i" | "u") => {
    const textarea = document.getElementById(
      "featuresText"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = formik.values.featuresText || "";
    const selectedText = val.substring(start, end);

    let newText = "";
    let newCursorStart = start;
    let newCursorEnd = end;

    if (selectedText) {
      const wrapped = `<${tag}>${selectedText}</${tag}>`;
      newText = val.substring(0, start) + wrapped + val.substring(end);
      newCursorStart = start;
      newCursorEnd = start + wrapped.length;
    } else {
      const tagPair = `<${tag}></${tag}>`;
      newText = val.substring(0, start) + tagPair + val.substring(end);
      newCursorStart = start + tag.length + 2;
      newCursorEnd = newCursorStart;
    }

    formik.setFieldValue("featuresText", newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  const featureLines = (formik.values.featuresText || "")
    .split("\n")
    .filter((line: string) => line.trim().length > 0);

  return (
    <div
      style={{
        width: "100%",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .add-plan-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          padding: 32px;
          width: 100%;
          box-sizing: border-box;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f3f4f6;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }
        .form-select {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          padding: 0 14px;
          font-size: 14px;
          color: #111827;
          background-color: #ffffff;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          padding: 8px 12px;
        }
        .toolbar-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          color: #334155;
        }
        .toolbar-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .features-textarea {
          width: 100%;
          border-radius: 0 0 8px 8px;
          border: 1px solid #cbd5e1;
          padding: 12px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          resize: vertical;
          min-height: 120px;
          color: #0f172a;
          box-sizing: border-box;
        }
        .features-textarea:focus {
          border-color: #2563eb;
        }
        .live-preview-box {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 14px;
          margin-top: 12px;
        }
        .live-preview-title {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .preview-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #334155;
          margin-bottom: 4px;
        }
        .preview-check {
          color: #10b981;
          font-weight: bold;
        }
        .stripe-help-text {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          line-height: 1.4;
        }
        .action-btn {
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
          border: 1px solid transparent;
          line-height: 1;
        }
        .action-btn-secondary {
          background-color: #f1f5f9;
          color: #475569;
          border-color: #cbd5e1;
        }
        .action-btn-secondary:hover {
          background-color: #e2e8f0;
          color: #0f172a;
        }
        .action-btn-primary {
          background-color: #2563eb;
          color: #ffffff;
        }
        .action-btn-primary:hover {
          background-color: #1d4ed8;
        }
        .action-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="add-plan-card">
        {/* Page Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 800,
                color: "#1e293b",
              }}
            >
              Add New Subscription Plan
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              Create a custom subscription tier, set trial periods, pricing, and configure section access permissions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/subscription-plans")}
            className="action-btn action-btn-secondary"
          >
            ← Back to Plans
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* SECTION 1: General Info */}
            <div>
              <div className="section-header">
                <span className="section-title">1. General Information</span>
              </div>
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label className="form-label" htmlFor="name">
                    Plan Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    classes="passwordlabel"
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Standard Tier"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "2px" }}>
                      {formik.errors.name}
                    </span>
                  )}
                </div>

                <div className="form-field-group">
                  <label className="form-label" htmlFor="tier">
                    Subscription Tier <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    id="tier"
                    name="tier"
                    className="form-select"
                    value={formik.values.tier}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="freemium">Freemium (Free Tier)</option>
                    <option value="standard">Standard Tier</option>
                    <option value="professional">Professional Tier</option>
                  </select>
                </div>

                <div className="form-field-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="description">
                    Short Description
                  </label>
                  <Input
                    classes="passwordlabel"
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Brief summary of plan benefits"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Pricing & Trial */}
            <div>
              <div className="section-header">
                <span className="section-title">2. Pricing & Trial Period</span>
              </div>
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label className="form-label" htmlFor="monthlyPrice">
                    Monthly Price ($) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    classes="passwordlabel"
                    type="number"
                    id="monthlyPrice"
                    name="monthlyPrice"
                    placeholder="e.g. 7.99"
                    value={String(formik.values.monthlyPrice)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label" htmlFor="yearlyPrice">
                    Yearly Price ($) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    classes="passwordlabel"
                    type="number"
                    id="yearlyPrice"
                    name="yearlyPrice"
                    placeholder="e.g. 69.99"
                    value={String(formik.values.yearlyPrice)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label" htmlFor="trialDays">
                    Free Trial Period (Days) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <Input
                    classes="passwordlabel"
                    type="number"
                    id="trialDays"
                    name="trialDays"
                    placeholder="e.g. 7"
                    value={String(formik.values.trialDays)}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Features List */}
            <div>
              <div className="section-header">
                <span className="section-title">
                  3. Features List (HTML Text Editor)
                </span>
              </div>
              <div className="form-field-group">
                <div>
                  <div className="editor-toolbar">
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#64748b",
                        marginRight: "6px",
                      }}
                    >
                      Format Selection:
                    </span>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => applyFormatting("b")}
                      title="Bold (<b>)"
                      style={{ fontWeight: "bold" }}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => applyFormatting("i")}
                      title="Italic (<i>)"
                      style={{ fontStyle: "italic" }}
                    >
                      I
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      onClick={() => applyFormatting("u")}
                      title="Underline (<u>)"
                      style={{ textDecoration: "underline" }}
                    >
                      U
                    </button>
                  </div>
                  <textarea
                    id="featuresText"
                    name="featuresText"
                    rows={6}
                    className="features-textarea"
                    value={formik.values.featuresText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Full how-to video library&#10;Tool recommendations&#10;7-day free trial"
                  />
                </div>

                {/* Live Preview */}
                {featureLines.length > 0 && (
                  <div className="live-preview-box">
                    <div className="live-preview-title">
                      Live Feature Render Preview
                    </div>
                    {featureLines.map((line: string, idx: number) => (
                      <div key={idx} className="preview-feature-item">
                        <span className="preview-check">✓</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: line,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: Dynamic Feature Access Permissions */}
            <div>
              <div className="section-header">
                <span className="section-title">4. Feature Access Permissions</span>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
                Toggle which sections and features mobile users can access when subscribed to this plan.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {accessibleFeatures.map((feat, index) => (
                  <div
                    key={feat.key || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: feat.enabled ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${feat.enabled ? "#bbf7d0" : "#fecaca"}`,
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="checkbox"
                        id={`add-feat-${feat.key}`}
                        checked={feat.enabled}
                        onChange={() => toggleFeature(index)}
                        style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#16a34a" }}
                      />
                      <div>
                        <label
                          htmlFor={`add-feat-${feat.key}`}
                          style={{ fontWeight: 600, fontSize: "14px", cursor: "pointer", margin: 0, color: "#1e293b" }}
                        >
                          {feat.label}
                        </label>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          Key: <code>{feat.key}</code>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          backgroundColor: feat.enabled ? "#dcfce7" : "#fee2e2",
                          color: feat.enabled ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {feat.enabled ? "ACCESSIBLE" : "LOCKED"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }}
                        title="Remove feature rule"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dropdown to add system feature */}
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#334155" }}>+ Select Feature from System Catalog</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select
                    value={selectedCatalogKey}
                    onChange={(e) => {
                      setSelectedCatalogKey(e.target.value);
                      addSelectedFeatureFromDropdown(e.target.value);
                    }}
                    style={{
                      flex: 1,
                      height: "44px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      padding: "0 14px",
                      fontSize: "14px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="">
                      {availableCatalogFeatures.length > 0
                        ? "-- Choose a feature to grant access --"
                        : "All available features are added to this plan"}
                    </option>
                    {availableCatalogFeatures.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label} ({cat.key})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>



            {/* SECTION 6: Active Status & Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "20px",
                borderTop: "1px solid #f3f4f6",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    accentColor: "#2563eb",
                  }}
                />
                <label
                  htmlFor="isActive"
                  style={{
                    cursor: "pointer",
                    margin: 0,
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: "14px",
                  }}
                >
                  Active Subscription Plan
                </label>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => navigate("/admin/subscription-plans")}
                  className="action-btn action-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="action-btn action-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Creating Plan..." : "Create Plan"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(AddSubscriptionPlan, ["admin"]);
