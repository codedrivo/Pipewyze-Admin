import React from "react";
import { useAddMaintenanceGuide } from "./useAddMaintenanceGuide";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import withRole from "../withRole";

function AddMaintenanceGuide() {
  const {
    navigate,
    fileInputRef,
    submitting,
    imagePreview,
    formik,
    handleImageChange,
    toolsList,
    codesList,
    checklist,
    addChecklistItem,
    removeChecklistItem,
    handleChecklistChange,
    handleCheckboxChange,
    equipmentsList,
  } = useAddMaintenanceGuide();

  const uniqueBrandModels = Array.from(
    new Set(
      equipmentsList
        .map((e: any) => {
          const b = (e.brand || "").trim();
          const m = (e.model || "").trim();
          if (b && m) return `${b} • ${m}`;
          return b || m || "";
        })
        .filter(Boolean)
    )
  ) as string[];

  const DEFAULT_IMAGE = "/no_image.png";

  return (
    <div
      id='addguide'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <div className='profile-card'>
        {/* Header */}
        <div className='gc-profile-flex'>
          <h2>Add Maintenance Guide</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/dashboard")}
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
              src={imagePreview || DEFAULT_IMAGE}
              alt='Maintenance Guide'
              className='image-preview-img'
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
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
            {/* Title */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='title'>
                  Guide Title <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='title'
                  name='title'
                  required
                  placeholder='e.g. Water Heater'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className='error' style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {formik.errors.title}
                  </div>
                )}
              </div>
            </div>

            {/* Brand / Model */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='brandModel'>Brand / Model</label>
                <select
                  id='brandModel'
                  name='brandModel'
                  value={formik.values.brandModel}
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
                >
                  <option value="">Select Brand / Model</option>
                  {uniqueBrandModels.map((bm: string) => (
                    <option key={bm} value={bm}>
                      {bm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expected Life */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='expectedLife'>Expected Life</label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='expectedLife'
                  name='expectedLife'
                  placeholder='e.g. 10–12 Years'
                  value={formik.values.expectedLife}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Difficulty */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='difficulty'>Difficulty</label>
                <select
                  id='difficulty'
                  name='difficulty'
                  value={formik.values.difficulty}
                  onChange={formik.handleChange}
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
                >
                  <option value='Easy'>Easy</option>
                  <option value='Intermediate'>Intermediate</option>
                  <option value='Advanced'>Advanced</option>
                </select>
              </div>
            </div>

            {/* Video URL */}
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

            {/* Overview */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='overview'>Overview</label>
                <textarea
                  id='overview'
                  name='overview'
                  placeholder='Overview explanation of the maintenance task...'
                  rows={4}
                  value={formik.values.overview}
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
              </div>
            </div>

            {/* Dynamic Checklist section */}
            <div style={{ width: "100%", marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", marginRight: "34px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Maintenance Checklist</h3>
                <button
                  type='button'
                  onClick={addChecklistItem}
                  className='custom-button w-auto'
                  style={{ padding: "6px 12px", fontSize: "13px", height: "auto" }}
                >
                  + Add Step
                </button>
              </div>

              {checklist.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "10px",
                    alignItems: "center"
                  }}
                >
                  <input
                    type='text'
                    placeholder='Task (e.g. Flush Tank)'
                    value={item.task}
                    onChange={(e) => handleChecklistChange(index, "task", e.target.value)}
                    style={{
                      flex: 2,
                      border: "1px solid #c7c7c7",
                      backgroundColor: "transparent",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                  <input
                    type='text'
                    placeholder='Frequency (e.g. Every 12 Months)'
                    value={item.frequency}
                    onChange={(e) => handleChecklistChange(index, "frequency", e.target.value)}
                    style={{
                      flex: 1,
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
                    onClick={() => removeChecklistItem(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "red",
                      fontSize: "20px",
                      cursor: "pointer",
                      width: "24px",
                      padding: 0
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Required Tools */}
            <div style={{ width: "100%", marginTop: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold" }}>Required Tools</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", border: "1px solid #c7c7c7", padding: "15px", borderRadius: "10px" }}>
                {toolsList.length === 0 ? (
                  <span style={{ color: "#777", fontSize: "14px" }}>No tools available. Add some in Essential Tools first.</span>
                ) : (
                  toolsList.map((tool) => (
                    <label key={tool.id || tool._id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                      <input
                        type='checkbox'
                        checked={formik.values.requiredTools.includes(tool.id || tool._id)}
                        onChange={(e) => handleCheckboxChange("requiredTools", tool.id || tool._id, e.target.checked)}
                      />
                      {tool.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Related Plumbing Codes */}
            <div style={{ width: "100%", marginTop: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold" }}>Related Plumbing Codes</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", border: "1px solid #c7c7c7", padding: "15px", borderRadius: "10px" }}>
                {codesList.length === 0 ? (
                  <span style={{ color: "#777", fontSize: "14px" }}>No plumbing codes available. Add some first.</span>
                ) : (
                  codesList.map((code) => (
                    <label key={code.id || code._id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                      <input
                        type='checkbox'
                        checked={formik.values.relatedCodes.includes(code.id || code._id)}
                        onChange={(e) => handleCheckboxChange("relatedCodes", code.id || code._id, e.target.checked)}
                      />
                      {code.code} - {code.title}
                    </label>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Submit Actions */}
          <div className='submitbtnwrap' style={{ marginTop: "30px" }}>
            <button
              type='submit'
              className={`custom-button w-auto`}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Add Guide"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(AddMaintenanceGuide, ["admin"]);
