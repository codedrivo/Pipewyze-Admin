import React from "react";
import { useAddUser } from "./useAddUser";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import withRole from "../withRole";
import { IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { USER_FORM_FIELDS } from "../../utils/message/messages";
import GoogleAutoComplete from "../../layout/GoogleAutoComplete";

function AddUser() {
  const {
    navigate,
    fileInputRef,
    formik,
    imagePreview,
    loading,
    showPassword,
    togglePasswordVisibility,
    handleImageChange,
    handlePhoneChange,
  } = useAddUser();

  const DEFAULT_PROFILE_IMAGE = "/default_profile.png";

  return (
    <div
      id='editprofile'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <div className='profile-card'>
        {/* Header */}
        <div className='gc-profile-flex'>
          <h2>Add User</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/users")}
            className='custom-button gc-back-btn mtop-0'
          >
            Back
          </button>
        </div>

        {/* Profile Image Upload */}
        <div className='profile-picture-upload'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <div
            className='image-preview-wrap'
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={imagePreview || DEFAULT_PROFILE_IMAGE}
              alt='Avatar'
              className='image-preview-img'
              onError={(e) => {
                e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
            <div className='image-edit-overlay'>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fff'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
              </svg>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className='formadduser from-fix-global-wrap'
          autoComplete='off'
        >
          <div className={`${form.profileform} from-fix-global`}>
            {/* Full Name */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor={USER_FORM_FIELDS.fullName.id}>
                  {USER_FORM_FIELDS.fullName.title}{" "}
                  {USER_FORM_FIELDS.fullName.required && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <Input
                  classes='passwordlabel'
                  type={USER_FORM_FIELDS.fullName.type}
                  id={USER_FORM_FIELDS.fullName.id}
                  name={USER_FORM_FIELDS.fullName.name}
                  required={USER_FORM_FIELDS.fullName.required}
                  placeholder={USER_FORM_FIELDS.fullName.placeholder}
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.fullName}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor={USER_FORM_FIELDS.email.id}>
                  {USER_FORM_FIELDS.email.title}{" "}
                  {USER_FORM_FIELDS.email.required && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <Input
                  classes='passwordlabel'
                  type={USER_FORM_FIELDS.email.type}
                  id={USER_FORM_FIELDS.email.id}
                  name={USER_FORM_FIELDS.email.name}
                  required={USER_FORM_FIELDS.email.required}
                  placeholder={USER_FORM_FIELDS.email.placeholder}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.email}
                  </div>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor={USER_FORM_FIELDS.phone.id}>
                  {USER_FORM_FIELDS.phone.title}{" "}
                  {USER_FORM_FIELDS.phone.required && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <Input
                  classes='passwordlabel'
                  type={USER_FORM_FIELDS.phone.type}
                  id={USER_FORM_FIELDS.phone.id}
                  name={USER_FORM_FIELDS.phone.name}
                  required={USER_FORM_FIELDS.phone.required}
                  placeholder={USER_FORM_FIELDS.phone.placeholder}
                  value={formik.values.phone}
                  onChange={handlePhoneChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Role */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='role'>
                  Role <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id='role'
                  name='role'
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    width: "100%",
                    border: "1px solid #c7c7c7",
                    backgroundColor: "transparent",
                    height: "53px",
                    borderRadius: "10px",
                    padding: "5px 16px",
                  }}
                >
                  <option value='home-owner'>Home Owner</option>
                  <option value='apprentice'>Apprentice</option>
                  <option value='licensed-plumber'>Licensed Plumber</option>
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.role}
                  </div>
                )}
              </div>
            </div>

            {formik.values.role === "licensed-plumber" && (
              <>
                {/* Google Maps Location Autocomplete */}
                <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
                  <div className='formgrp'>
                    <label htmlFor='autocomplete'>Address / Location (Google Maps)</label>
                    <GoogleAutoComplete
                      onChange={(fullAddress, locationName, lat, lng) => {
                        formik.setFieldValue("latitude", lat ? String(lat) : "");
                        formik.setFieldValue("longitude", lng ? String(lng) : "");
                        formik.setFieldValue("address", fullAddress || "");
                      }}
                      currentState={formik.values.address}
                      placeholder="Enter the address"
                    />
                  </div>
                </div>

                {/* Latitude */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label htmlFor='latitude'>Latitude</label>
                    <Input
                      classes='passwordlabel'
                      type='number'
                      id='latitude'
                      name='latitude'
                      readonly={true}
                      placeholder='Auto-populated'
                      value={formik.values.latitude}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.latitude && formik.errors.latitude && (
                      <div
                        className='error'
                        style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                      >
                        {formik.errors.latitude}
                      </div>
                    )}
                  </div>
                </div>

                {/* Longitude */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label htmlFor='longitude'>Longitude</label>
                    <Input
                      classes='passwordlabel'
                      type='number'
                      id='longitude'
                      name='longitude'
                      readonly={true}
                      placeholder='Auto-populated'
                      value={formik.values.longitude}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.longitude && formik.errors.longitude && (
                      <div
                        className='error'
                        style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                      >
                        {formik.errors.longitude}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor={USER_FORM_FIELDS.password.id}>
                  {USER_FORM_FIELDS.password.title}{" "}
                  {USER_FORM_FIELDS.password.required && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                </label>
                <Input
                  classes='passwordlabel'
                  type={showPassword ? "text" : USER_FORM_FIELDS.password.type}
                  id={USER_FORM_FIELDS.password.id}
                  name={USER_FORM_FIELDS.password.name}
                  required={USER_FORM_FIELDS.password.required}
                  placeholder={USER_FORM_FIELDS.password.placeholder}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rightIcon={
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge='end'
                      size='small'
                      style={{ padding: "8px", marginRight: "5px" }}
                    >
                      <Icon
                        icon={
                          showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"
                        }
                      />
                    </IconButton>
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.password}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className='submitbtnwrap' style={{ marginTop: "30px" }}>
            <button
              type='submit'
              className={`custom-button w-auto`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(AddUser, ["admin"]);
