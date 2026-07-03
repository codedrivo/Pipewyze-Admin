import { useState } from "react";
import Input from "../UI/input/Input";
import { useTranslation } from "react-i18next";
import classes from "./Reset.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useReset } from "./useReset";
import { Link } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ResetPasswordBox() {
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();

  const email = localStorage.getItem("email");
  const { resetPasswordFormik } = useReset(email);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleCPasswordVisibility = () => {
    setIsCPasswordVisible((prev) => !prev);
  };

  return (
    <div className='login-panel-wrapper'>
      {/* ── Left decorative panel ── */}
      <div className='login-left-panel'>
        <div className='panel-logo-area'>
          <img
            src='/logo-icon.png'
            alt='PipeWyze'
            className='panel-logo-icon'
          />
        </div>
        <p className='panel-bottom-text'>
          Join <strong>PipeWyze</strong> to manage your plumbing business with ease and efficiency.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className='login-right-panel'>
        <div
          className={`login-right-inner ${lang === "fa" ? classes.rtl : ""}`}
        >
          {/* PipeWyze Logo */}
          <div className='gc-logo-wrap'>
            <img src='/logo.svg' alt='PipeWyze' className='gc-logo-img' />
          </div>

          <h2 className='login-heading'>{t("Reset Password")}</h2>
          <p className='login-subheading'>
            Enter the OTP sent to your email and set a new password.
          </p>

          <form
            id='resetpassword'
            className='login-form'
            onSubmit={resetPasswordFormik.handleSubmit}
          >
            <div className='formgrp'>
              <Input
                classes='passwordlabel'
                type='text'
                id='Otp'
                placeholder={t("Enter your OTP")}
                name='otp'
                onChange={resetPasswordFormik.handleChange}
                onBlur={resetPasswordFormik.handleBlur}
                value={resetPasswordFormik.values.otp}
                errorMsg={
                  resetPasswordFormik.touched.otp ||
                  resetPasswordFormik.submitCount > 0
                    ? resetPasswordFormik.errors.otp
                    : undefined
                }
              />
            </div>

            <div className='formgrp'>
              <Input
                classes='passwordlabel'
                type={isPasswordVisible ? "text" : "password"}
                id='Password'
                placeholder={t("Enter your password")}
                name='password'
                onChange={resetPasswordFormik.handleChange}
                onBlur={resetPasswordFormik.handleBlur}
                value={resetPasswordFormik.values.password}
                errorMsg={
                  resetPasswordFormik.touched.password ||
                  resetPasswordFormik.submitCount > 0
                    ? resetPasswordFormik.errors.password
                    : undefined
                }
                rightIcon={
                  <FontAwesomeIcon
                    icon={isPasswordVisible ? faEye : faEyeSlash}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                }
              />
            </div>

            <div className='formgrp'>
              <Input
                classes='passwordlabel'
                type={isCPasswordVisible ? "text" : "password"}
                id='Confirm Password'
                placeholder={t("Enter your confirm password")}
                name='confirmpassword'
                onChange={resetPasswordFormik.handleChange}
                onBlur={resetPasswordFormik.handleBlur}
                value={resetPasswordFormik.values.confirmpassword}
                errorMsg={
                  resetPasswordFormik.touched.confirmpassword ||
                  resetPasswordFormik.submitCount > 0
                    ? resetPasswordFormik.errors.confirmpassword
                    : undefined
                }
                rightIcon={
                  <FontAwesomeIcon
                    icon={isCPasswordVisible ? faEye : faEyeSlash}
                    onClick={toggleCPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                }
              />
            </div>

            <button type='submit' className='custom-button mt-30'>
              {t("Save")}
            </button>

            <Link className={classes.forgat_pass} to='/login'>
              {t("Back to login")}
            </Link>
          </form>

          <p className='login-footer'>
            © 2026 PipeWyze. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordBox;
