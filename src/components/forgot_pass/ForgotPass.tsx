import Input from "../UI/input/Input";
import { useTranslation } from "react-i18next";
import classes from "./Forgot.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useForgotPass } from "./useForgot";
import { Link } from "react-router-dom";



function ForgotPassBox() {
  const { forgotPassFormik, loading } = useForgotPass();
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  return (
    <div className="login-panel-wrapper">

      {/* ── Left decorative panel ── */}
      <div className="login-left-panel">
        <div className="panel-logo-area">
          <img src="/logo-icon.png" alt="PipeWyze" className="panel-logo-icon" />
        </div>
        <p className="panel-bottom-text">
          Join <strong>PipeWyze</strong> to manage your plumbing business
          with ease and efficiency.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-right-panel">
        <div className={`login-right-inner ${lang === "fa" ? classes.rtl : ""}`}>

          {/* PipeWyze Logo */}
          <div className="gc-logo-wrap">
            <img src="/logo.svg" alt="PipeWyze" className="gc-logo-img" />
          </div>

          <h2 className="login-heading">{t("Forgot Password")}</h2>
          <p className="login-subheading">
            Enter your email address and we'll send you a reset link.
          </p>

          <form id="forgotPassword" className="login-form" onSubmit={forgotPassFormik.handleSubmit}>
            <div className="formgrp">
              <label htmlFor="email">
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                classes="passwordlabel"
                type={"text"}
                id="email"
                placeholder={"Enter your email address"}
                name="email"
                onChange={forgotPassFormik.handleChange}
                onBlur={forgotPassFormik.handleBlur}
                value={forgotPassFormik.values.email}
                hideLabel={true}
                errorMsg={
                  forgotPassFormik.touched.email || forgotPassFormik.submitCount > 0
                    ? forgotPassFormik.errors.email
                    : undefined
                }
              />
            </div>

            <button className="custom-button mt-30" type="submit" disabled={loading}>
              {loading ? "Sending..." : t("Send Email")}
            </button>

            <Link className={classes.forgat_pass} to="/login">
              {t("Back to login")}
            </Link>
          </form>

          <p className="login-footer">© 2026 PipeWyze. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
}

export default ForgotPassBox;
