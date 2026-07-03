import { useState } from "react";
import Input from "../UI/input/Input";
import { useTranslation } from "react-i18next";
import form from "./formcus.module.scss";
import s from "./changePass.module.scss";
import { useChangePass } from "./useChangePass";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function ChangePass() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { changePasswordFormik } = useChangePass();

  const [showOld, setShowOld]   = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [showConf, setShowConf] = useState(false);

  const EyeToggle = ({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
    <FontAwesomeIcon
      icon={visible ? faEyeSlash : faEye}
      onClick={onToggle}
      className={s.eyeIcon}
    />
  );

  return (
    <div
      className={`${form.myprofilewrapper} dashboard-card-global change-pass-wrap`}
      id="myprofilewrapper"
    >
      <div className="profile-card">

        {/* ── Header: title + back button (same as Update Profile) ── */}
        <div className="gc-profile-flex">
          <h2>Change Password</h2>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="custom-button gc-back-btn mtop-0"
          >
            Back
          </button>
        </div>

        {/* ── Form (same class names as Update Profile) ── */}
        <form
          onSubmit={changePasswordFormik.handleSubmit}
          className="formadduser from-fix-global-wrap"
          autoComplete="off"
        >
          <div className={`${form.profileform} from-fix-global`}>

            {/* Old Password */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="password_old">
                  Old Password <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type={showOld ? "text" : "password"}
                  id="password_old"
                  placeholder={t("Enter your old password")}
                  name="password_old"
                  onChange={changePasswordFormik.handleChange}
                  onBlur={changePasswordFormik.handleBlur}
                  value={changePasswordFormik.values.password_old}
                  errorMsg={
                    changePasswordFormik.touched.password_old ||
                    changePasswordFormik.submitCount > 0
                      ? changePasswordFormik.errors.password_old
                      : undefined
                  }
                  autoComplete="off"
                  rightIcon={
                    <EyeToggle
                      visible={showOld}
                      onToggle={() => setShowOld((p) => !p)}
                    />
                  }
                />
              </div>
            </div>

            {/* New Password */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="password_new">
                  New Password <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type={showNew ? "text" : "password"}
                  id="password_new"
                  placeholder={t("Enter your new password")}
                  name="password_new"
                  onChange={changePasswordFormik.handleChange}
                  onBlur={changePasswordFormik.handleBlur}
                  value={changePasswordFormik.values.password_new}
                  errorMsg={
                    changePasswordFormik.touched.password_new ||
                    changePasswordFormik.submitCount > 0
                      ? changePasswordFormik.errors.password_new
                      : undefined
                  }
                  autoComplete="off"
                  rightIcon={
                    <EyeToggle
                      visible={showNew}
                      onToggle={() => setShowNew((p) => !p)}
                    />
                  }
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="cpassword">
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type={showConf ? "text" : "password"}
                  id="cpassword"
                  placeholder={t("Enter your confirm password")}
                  name="cpassword"
                  onChange={changePasswordFormik.handleChange}
                  onBlur={changePasswordFormik.handleBlur}
                  value={changePasswordFormik.values.cpassword}
                  errorMsg={
                    changePasswordFormik.touched.cpassword ||
                    changePasswordFormik.submitCount > 0
                      ? changePasswordFormik.errors.cpassword
                      : undefined
                  }
                  autoComplete="off"
                  rightIcon={
                    <EyeToggle
                      visible={showConf}
                      onToggle={() => setShowConf((p) => !p)}
                    />
                  }
                />
              </div>
            </div>

          </div>

          {/* ── Submit (same as Update Profile) ── */}
          <div className="submit-btn-wrap">
            <button type="submit" className="custom-button submit-btn">
              {t("Save")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default ChangePass;
