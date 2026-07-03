import { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "../input/Input";
import form from "./formcus.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useProfileUpdate } from "./useProfileUpdate";
import { useNavigate } from "react-router-dom";

const FormCus = () => {
  const DEFAULT_PROFILE_IMAGE = "/default_profile.png";
  const { addProfileFormik } = useProfileUpdate();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatUSPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  useEffect(() => {
    if (user) {
      addProfileFormik.setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        // DOB: user.DOB,
        // maritalStatus: user.maritalStatus || "",
        phoneNumber: formatUSPhoneNumber(user.phone || user.phoneNumber || ""),
        email: user.email || "",
        profileImage: null,
      });
      setPreview(user.profileimageurl || DEFAULT_PROFILE_IMAGE);
    }
  }, [user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Update preview
      addProfileFormik.setFieldValue("profileImage", file);
    }
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatUSPhoneNumber(e.target.value);
    addProfileFormik.setFieldValue("phoneNumber", formattedPhoneNumber);
  };

  return (
    <div
      id='editprofile'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <div className='profile-card'>
        <div className='gc-profile-flex'>
          <h2>Update Profile</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/dashboard")}
            className='custom-button gc-back-btn mtop-0'
          >
            Back
          </button>
        </div>

        <div className='profile-picture-upload'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div className='image-preview-wrap' onClick={() => fileInputRef.current?.click()}>
            <img
              src={preview || DEFAULT_PROFILE_IMAGE}
              alt='Avatar'
              className='image-preview-img'
              onError={(e) => { e.currentTarget.src = DEFAULT_PROFILE_IMAGE; }}
            />
            <div className='image-edit-overlay'>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          </div>
        </div>

        <form
          onSubmit={addProfileFormik.handleSubmit}
          className='formadduser from-fix-global-wrap'
          autoComplete='off'
        >
          <div className={`${form.profileform} from-fix-global`}>
            {/* First Name */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='fName'>
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='firstName'
                  placeholder={"Enter your first name"}
                  name='firstName'
                  onChange={addProfileFormik.handleChange}
                  value={addProfileFormik.values.firstName}
                />
                {addProfileFormik.touched.firstName &&
                  addProfileFormik.errors.firstName && (
                    <div className='error'>
                      {addProfileFormik.errors.firstName}
                    </div>
                  )}
              </div>
            </div>

            {/* Last Name */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='lName'>
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='lastName'
                  placeholder={"Enter your last name"}
                  name='lastName'
                  onChange={addProfileFormik.handleChange}
                  value={addProfileFormik.values.lastName}
                />
                {addProfileFormik.touched.lastName &&
                  addProfileFormik.errors.lastName && (
                    <div className='error'>
                      {addProfileFormik.errors.lastName}
                    </div>
                  )}
              </div>
            </div>

            {/* Email */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Email'>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes={`passwordlabel ${addProfileFormik.values.email ? "disabled-input" : ""}`}
                  type={"text"}
                  id='email'
                  placeholder={"Enter your email address"}
                  name='email'
                  onChange={addProfileFormik.handleChange}
                  value={addProfileFormik.values.email}
                  disabled
                />
                {addProfileFormik.touched.email &&
                  addProfileFormik.errors.email && (
                    <div className='error'>{addProfileFormik.errors.email}</div>
                  )}
              </div>
            </div>
            {/* DOB */}
            {/*<div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor='dob'>
                  Date of Birth <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes={`passwordlabel`}
                  type="date"
                  name="DOB"
                  id='DOB'
                  value={
                    addProfileFormik.values.DOB
                      ? new Date(addProfileFormik.values.DOB)
                        .toISOString()
                        .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    addProfileFormik.setFieldValue(
                      "DOB",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
              </div>
            </div>
            {/* Marital Status */}
            {/*<div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor='maritial'>
                  Marital Status<span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="maritalStatus"
                  value={addProfileFormik.values.maritalStatus}
                  onChange={addProfileFormik.handleChange}
                >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div> */}

            {/* Phone Number */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='phoneNumber'>
                  Phone Number<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  name='phoneNumber'
                  id='phoneNumber'
                  placeholder='(555) 123-4567'
                  onChange={handlePhoneNumberChange}
                  value={addProfileFormik.values.phoneNumber}
                  maxLength={14}
                />
                {addProfileFormik.touched.phoneNumber &&
                  addProfileFormik.errors.phoneNumber && (
                    <div className='error'>
                      {addProfileFormik.errors.phoneNumber}
                    </div>
                  )}
              </div>
            </div>

            {/* Phone Number */}
            {/*<div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor='phone'>
                  Phone Number<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  onChange={addProfileFormik.handleChange}
                  value={addProfileFormik.values.phoneNumber}
                />
                {addProfileFormik.touched.phoneNumber &&
                  addProfileFormik.errors.phoneNumber && (
                    <div className='error'>
                      {addProfileFormik.errors.phoneNumber}
                    </div>
                  )}
              </div>
            </div> */}
          </div>
          <div className='submit-btn-wrap'>
            <button className='custom-button submit-btn'>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FormCus;
