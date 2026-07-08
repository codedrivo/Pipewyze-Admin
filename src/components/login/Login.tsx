import { useState } from "react";
import Input from "../UI/input/Input";
import { useTranslation } from "react-i18next";
import classes from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLogin } from "./useLogin";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



function LoginBox() {
  const { loginFormik, loading } = useLogin();
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="login-panel-wrapper">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
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


              <>
                {/* PipeWyze Logo */}
                <div className="gc-logo-wrap">
                  <img src="/logo.svg" alt="PipeWyze" className="gc-logo-img" />
                </div>

                <h2 className="login-heading">{t("Admin Login")}</h2>
                <p className="login-subheading">
                  Sign in to manage plumbing services with ease and efficiency.
                </p>

                <form onSubmit={loginFormik.handleSubmit} className="login-form">
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
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      value={loginFormik.values.email}
                      hideLabel={true}
                      errorMsg={
                        loginFormik.touched.email || loginFormik.submitCount > 0
                          ? loginFormik.errors.email
                          : undefined
                      }
                    />
                  </div>
                  <div className="formgrp">
                    <label htmlFor="Password">
                      Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      classes="passwordlabel"
                      type={isPasswordVisible ? "text" : "password"}
                      id={"Password"}
                      placeholder={"Enter your password"}
                      name="password"
                      onChange={loginFormik.handleChange}
                      onBlur={loginFormik.handleBlur}
                      value={loginFormik.values.password}
                      hideLabel={true}
                      errorMsg={
                        loginFormik.touched.password || loginFormik.submitCount > 0
                          ? loginFormik.errors.password
                          : undefined
                      }
                      rightIcon={
                        <FontAwesomeIcon
                          icon={isPasswordVisible ? faEyeSlash : faEye}
                          onClick={togglePasswordVisibility}
                        />
                      }
                    />
                  </div>

                  <button className="custom-button mt-30" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : t("login")}
                  </button>

                  <Link className={classes.forgat_pass} to="/forgot-password">
                    {t("forgetPass")}
                  </Link>
                  <div className={classes.checkbox}></div>
                </form>

                <p className="login-footer">© 2026 PipeWyze. All rights reserved.</p>
              </>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LoginBox;
