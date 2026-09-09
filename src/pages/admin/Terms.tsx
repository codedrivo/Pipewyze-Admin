import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

function TermsAndConditions() {
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
            Terms & Conditions
          </h1>
          <p style={{ fontSize: "16px", color: "#dbeafe", margin: 0, lineHeight: 1.6, maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
            Please review the terms, rules, and guidelines governing your access to and use of the PipeWyze application and services.
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
            Welcome to PipeWyze. These Terms and Conditions constitute a legally binding agreement between you and PipeWyze regarding your use of our platforms, mobile applications, and admin dashboard services.
          </p>

          {/* Section 1 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ marginBottom: "20px" }}>
            By registering for, accessing, or using PipeWyze, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree to all terms, you must refrain from accessing the platform.
          </p>

          {/* Section 2 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            2. Platform Description & Services
          </h2>
          <p style={{ marginBottom: "20px" }}>
            PipeWyze provides an all-in-one plumbing management, diagnostic guidance, equipment tracking, training video repository, and plumbing code reference platform for homeowners, plumbing apprentices, and licensed plumbers.
          </p>

          {/* Section 3 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            3. User Account Responsibilities
          </h2>
          <p style={{ marginBottom: "14px" }}>
            To access certain features of the Service, you must create an account. You agree to:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "24px" }}>
            <li style={{ marginBottom: "10px" }}>
              Provide accurate, current, and complete registration information.
            </li>
            <li style={{ marginBottom: "10px" }}>
              Maintain the confidentiality of your account credentials.
            </li>
            <li style={{ marginBottom: "10px" }}>
              Notify us immediately of any unauthorized use or security breach.
            </li>
          </ul>

          {/* Section 4 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            4. Diagnostic Guidance & Professional Disclaimer
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Diagnostic recommendations, pipe dimension formulas, and code references provided by PipeWyze serve as informational tools. Plumbers and users remain responsible for verifying field conditions and adhering to local municipal plumbing codes.
          </p>

          {/* Section 5 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            5. Intellectual Property
          </h2>
          <p style={{ marginBottom: "20px" }}>
            All original content, features, layout designs, and software code on PipeWyze are the exclusive property of PipeWyze and are protected by applicable intellectual property laws.
          </p>

          {/* Section 6 */}
          <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 700, marginTop: "36px", marginBottom: "14px" }}>
            6. Termination of Access
          </h2>
          <p style={{ marginBottom: "20px" }}>
            We reserve the right to suspend or terminate your account access immediately, without prior notice, if you breach any provision of these Terms.
          </p>

          {/* Callout Box - Contact Support */}
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
              <Icon icon="lucide:file-text" style={{ fontSize: "20px", color: "#2563eb" }} />
              Legal & Compliance Contact
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
              If you have any questions regarding these Terms & Conditions, please contact our legal team at{" "}
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
            <Link to="/terms" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
              Terms & Conditions
            </Link>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <Link to="/privacy" style={{ color: "#64748b", textDecoration: "none" }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TermsAndConditions;
