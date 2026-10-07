import React from "react";
import { useEditEssentialTool } from "./useEditEssentialTool";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";

function EditEssentialTool() {
  const {
    navigate,
    fileInputRef,
    loading,
    submitting,
    imagePreview,
    formik,
    handleImageChange,
    bestUsedFor,
    howToUse,
    safetyTips,
    handleListChange,
    addListItem,
    removeListItem,
  } = useEditEssentialTool();

  const DEFAULT_TOOL_IMAGE = "/no_image.png";

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      id='editprofile'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <div className='profile-card'>
        {/* Header */}
        <div className='gc-profile-flex'>
          <h2>Update Essential Tool</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/essential-tools")}
            className='custom-button gc-back-btn mtop-0'
          >
            Back
          </button>
        </div>

        {/* Image Upload */}
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
              src={imagePreview || DEFAULT_TOOL_IMAGE}
              alt='Tool'
              className='image-preview-img'
              onError={(e) => {
                e.currentTarget.src = DEFAULT_TOOL_IMAGE;
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
            {/* Tool Name */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='name'>
                  Tool Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='name'
                  name='name'
                  required
                  placeholder='e.g. Pipe Wrench'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.name}
                  </div>
                )}
              </div>
            </div>

            {/* Tag */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='tag'>Tag</label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='tag'
                  name='tag'
                  placeholder="e.g. Brian's Pick"
                  value={formik.values.tag}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Purpose */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='purpose'>Purpose</label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='purpose'
                  name='purpose'
                  placeholder='e.g. Used to tighten and loosen threaded pipe.'
                  value={formik.values.purpose}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Recommendation Link */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='recommendationLink'>Recommendation Link</label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='recommendationLink'
                  name='recommendationLink'
                  placeholder='e.g. www.amazon.com'
                  value={formik.values.recommendationLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Audience Selection */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='audience'>
                  Audience <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id='audience'
                  name='audience'
                  value={formik.values.audience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    width: "100%",
                    border: "1px solid #c7c7c7",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: "15px",
                    height: "48px",
                  }}
                >
                  <option value='home-owner'>Homeowner</option>
                  <option value='apprentice'>Apprentice</option>
                  <option value='licensed-plumber'>Licensed Plumber</option>
                </select>
                {formik.touched.audience && formik.errors.audience && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.audience}
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Video Link */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='recommendedVideo'>Recommended Video Link</label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='recommendedVideo'
                  name='recommendedVideo'
                  placeholder='e.g. https://www.youtube.com/watch?v=...'
                  value={formik.values.recommendedVideo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Description */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='description'>
                  Description <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  placeholder='Used for gripping and turning pipes...'
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    width: "100%",
                    border: "1px solid #c7c7c7",
                    backgroundColor: "transparent",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: "15px",
                  }}
                />
                {formik.touched.description && formik.errors.description && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Best Used For */}
            <div style={{ width: "100%", marginTop: "20px", padding: "0 12px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", fontSize: "15px" }}>Best Used For</label>
                <button
                  type='button'
                  onClick={() => addListItem("bestUsedFor")}
                  className='custom-button w-auto'
                  style={{ padding: "6px 12px", fontSize: "13px", height: "auto" }}
                >
                  + Add Item
                </button>
              </div>
              {bestUsedFor.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" }}>
                  <input
                    type='text'
                    placeholder='e.g. Steel Pipe'
                    value={item}
                    onChange={(e) => handleListChange("bestUsedFor", index, e.target.value)}
                    style={{
                      flex: 1,
                      width: "100%",
                      border: "1px solid #c7c7c7",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => removeListItem("bestUsedFor", index)}
                    style={{ background: "none", border: "none", color: "red", fontSize: "20px", cursor: "pointer", width: "24px", padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Dynamic How To Use */}
            <div style={{ width: "100%", marginTop: "20px", padding: "0 12px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", fontSize: "15px" }}>How to Use</label>
                <button
                  type='button'
                  onClick={() => addListItem("howToUse")}
                  className='custom-button w-auto'
                  style={{ padding: "6px 12px", fontSize: "13px", height: "auto" }}
                >
                  + Add Step
                </button>
              </div>
              {howToUse.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" }}>
                  <input
                    type='text'
                    placeholder='e.g. Apply pressure evenly'
                    value={item}
                    onChange={(e) => handleListChange("howToUse", index, e.target.value)}
                    style={{
                      flex: 1,
                      width: "100%",
                      border: "1px solid #c7c7c7",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => removeListItem("howToUse", index)}
                    style={{ background: "none", border: "none", color: "red", fontSize: "20px", cursor: "pointer", width: "24px", padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Dynamic Safety Tips */}
            <div style={{ width: "100%", marginTop: "20px", padding: "0 12px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", fontSize: "15px" }}>Safety Tips</label>
                <button
                  type='button'
                  onClick={() => addListItem("safetyTips")}
                  className='custom-button w-auto'
                  style={{ padding: "6px 12px", fontSize: "13px", height: "auto" }}
                >
                  + Add Tip
                </button>
              </div>
              {safetyTips.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" }}>
                  <input
                    type='text'
                    placeholder='e.g. Wear protective gloves'
                    value={item}
                    onChange={(e) => handleListChange("safetyTips", index, e.target.value)}
                    style={{
                      flex: 1,
                      width: "100%",
                      border: "1px solid #c7c7c7",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => removeListItem("safetyTips", index)}
                    style={{ background: "none", border: "none", color: "red", fontSize: "20px", cursor: "pointer", width: "24px", padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Submit Actions */}
            <div className='submitbtnwrap' style={{ width: "100%", marginTop: "30px", padding: "0 12px" }}>
              <button
                type='submit'
                className={`custom-button w-auto`}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(EditEssentialTool, ["admin"]);
