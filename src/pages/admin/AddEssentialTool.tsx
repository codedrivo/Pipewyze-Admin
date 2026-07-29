import React from "react";
import { useAddEssentialTool } from "./useAddEssentialTool";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import withRole from "../withRole";

function AddEssentialTool() {
  const {
    navigate,
    fileInputRef,
    submitting,
    imagePreview,
    formik,
    handleImageChange,
  } = useAddEssentialTool();

  const DEFAULT_TOOL_IMAGE = "/no_image.png";

  return (
    <div
      id='editprofile'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <div className='profile-card'>
        {/* Header */}
        <div className='gc-profile-flex'>
          <h2>Add Essential Tool</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/essential-tools")}
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
          </div>

          {/* Submit Actions */}
          <div className='submitbtnwrap' style={{ marginTop: "30px" }}>
            <button
              type='submit'
              className={`custom-button w-auto`}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Add Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(AddEssentialTool, ["admin"]);
