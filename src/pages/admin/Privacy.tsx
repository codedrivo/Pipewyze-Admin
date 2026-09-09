import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

function PrivacyPolicy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Header / Navigation Bar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 32px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo & Tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#1e3a8a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <Icon icon="lucide:wrench" style={{ fontSize: "20px" }} />
              </div>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                Pipe<span style={{ color: "#2563eb" }}>Wyze</span>
              </span>
            </Link>
          </div>

          {/* Nav Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              to="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1e293b",
                textDecoration: "none",
                border: "1px solid #cbd5e1",
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                transition: "all 0.2s ease",
              }}
            >
              Login
            </Link>
            <a
              href="mailto:pipewyze-admin@yopmail.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                textDecoration: "none",
                backgroundColor: "#1e3a8a",
                padding: "8px 20px",
                borderRadius: "9999px",
                transition: "all 0.2s ease",
              }}
            >
              Contact Us
              <Icon icon="lucide:arrow-up-right" style={{ fontSize: "16px" }} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          padding: "64px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "16px", color: "#dbeafe", margin: 0, lineHeight: 1.6, maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            At PipeWyze, we value your trust. This document outlines how we collect, safeguard, and use your personal information and diagnostic data.
          </p>
        </div>
      </section>

      {/* Main Content Area Container */}
      <main
        style={{
          flex: 1,
          maxWidth: "1000px",
          width: "100%",
          margin: "-40px auto 0",
          padding: "0 24px 60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Main White Content Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "48px 56px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            lineHeight: 1.7,
            fontSize: "15px",
            color: "#334155",
          }}
        >
          {/* Top Last Updated Badge Box */}
          <div
            style={{
              backgroundColor: "#eff6ff",
              borderRadius: "12px",
              padding: "12px 20px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#1e40af",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid #dbeafe",
            }}
          >
            <Icon icon="lucide:calendar" style={{ color: "#2563eb", fontSize: "18px" }} />
            <span>Last Updated: <strong>September 9, 2026</strong></span>
          </div>

          <p style={{ fontSize: "16px", color: "#334155", marginBottom: "28px", fontWeight: 400, lineHeight: 1.8 }}>
            At PipeWyze, accessible from our web dashboard and mobile applications, protecting customer, technician, and apprentice privacy is paramount. This Privacy Policy details the types of information we collect and record, and how we utilize it.
          </p>

          {/* Section 1 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            1. Overview & Scope
          </h2>
          <p style={{ marginBottom: "20px" }}>
            This policy applies to all users of PipeWyze services, including plumbing contractors, apprentices, and individual property owners. By using our services, you consent to the data collection practices described herein.
          </p>

          {/* Section 2 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            2. Information We Collect
          </h2>
          <p style={{ marginBottom: "14px" }}>
            We collect information that you provide directly to us when setting up an account, executing diagnostics, ordering equipment, or contacting support:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "24px" }}>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#0f172a" }}>Account Credentials:</strong> Name, professional email address, phone number, and business license identifiers.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#0f172a" }}>System & Diagnostic Logs:</strong> Equipment inspection logs, pipe sizing calculations, diagnostic photos, and notes saved within the app.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#0f172a" }}>Payment & Billing Info:</strong> Secure billing details handled via PCI-compliant payment gateways.
            </li>
          </ul>

          {/* Section 3 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            3. How We Use Your Information
          </h2>
          <p style={{ marginBottom: "14px" }}>
            The data collected is used solely to operate, improve, and personalize your experience on PipeWyze:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "24px" }}>
            <li style={{ marginBottom: "10px" }}>To enable real-time diagnostic guidance and code reference lookups.</li>
            <li style={{ marginBottom: "10px" }}>To manage your account, subscription, and job history.</li>
            <li style={{ marginBottom: "10px" }}>To deliver technical support and critical security updates.</li>
          </ul>

          {/* Section 4 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            4. Data Security & Retention
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We implement industry-standard encryption protocols (TLS in transit, AES-256 at rest) to safeguard your sensitive information against unauthorized access, disclosure, or alteration. Data is retained only as long as necessary to fulfill the service requirements or comply with legal obligations.
          </p>

          {/* Section 5 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            5. Cookies and Tracking Technologies
          </h2>
          <p style={{ marginBottom: "20px" }}>
            PipeWyze uses session tokens and essential browser storage to maintain active sessions, remember user preferences, and secure account access. We do not sell your personal data or tracking profile to third-party advertisers.
          </p>

          {/* Section 6 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            6. Your Privacy Rights
          </h2>
          <p style={{ marginBottom: "20px" }}>
            You have the right to request access to your stored personal data, request corrections to inaccurate information, or request full account deletion at any time by contacting our Privacy Officer.
          </p>

          {/* Callout Box - Contact Privacy Officer */}
          <div
            style={{
              backgroundColor: "#eff6ff",
              borderLeft: "4px solid #2563eb",
              borderRadius: "0 16px 16px 0",
              padding: "24px 28px",
              marginTop: "40px",
            }}
          >
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#1e3a8a", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon icon="lucide:shield-check" style={{ fontSize: "20px", color: "#2563eb" }} />
              Contact Privacy Officer
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
              For any privacy-related inquiries, data requests, or compliance questions, please contact us directly at{" "}
              <a href="mailto:pipewyze-admin@yopmail.com" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "underline" }}>
                pipewyze-admin@yopmail.com
              </a>
              .
            </p>
          </div>
        </div>

        {/* Call To Action (CTA) Banner Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            borderRadius: "24px",
            padding: "40px 48px",
            marginTop: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            color: "#ffffff",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#93c5fd" }}>
              CONTACT
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: 800, margin: "8px 0 8px 0" }}>
              Have questions or need assistance?
            </h2>
            <p style={{ fontSize: "15px", color: "#dbeafe", margin: 0, maxWidth: "550px" }}>
              Reach out to our support team anytime. We are dedicated to providing prompt and reliable help for all PipeWyze users.
            </p>
          </div>
          <a
            href="mailto:pipewyze-admin@yopmail.com"
            style={{
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.35)",
              transition: "transform 0.2s ease",
            }}
          >
            Get Started
            <Icon icon="lucide:arrow-up-right" style={{ fontSize: "18px" }} />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          padding: "36px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {/* Copyright */}
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            &copy; {new Date().getFullYear()} PipeWyze. All rights reserved.
          </p>

          {/* Social / Center Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
              Pipe<span style={{ color: "#2563eb" }}>Wyze</span>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px" }}>
            <a href="mailto:pipewyze-admin@yopmail.com" style={{ color: "#64748b", textDecoration: "none" }}>
              Contact
            </a>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <Link to="/terms" style={{ color: "#64748b", textDecoration: "none" }}>
              Terms & Conditions
            </Link>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <Link to="/privacy" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
