import React from "react";
import { useEditPlumbingCode } from "./useEditPlumbingCode";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import Editor from "../../components/common/Editor";

function EditPlumbingCode() {
  const { navigate, loading, submitting, formik, categories } = useEditPlumbingCode();

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
          <h2>Update Plumbing Code</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/plumbing-codes")}
            className='custom-button gc-back-btn mtop-0'
          >
            Back
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className='formadduser from-fix-global-wrap'
          autoComplete='off'
        >
          <div className={`${form.profileform} from-fix-global`}>
            {/* Category */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='category'>
                  Category <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id='category'
                  name='category'
                  value={formik.values.category}
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
                  <option value='' disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat.name}>
                      {cat.name} - {cat.fullName}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.category}
                  </div>
                )}
              </div>
            </div>

            {/* Code Identifier */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='code'>
                  Code Identifier <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='code'
                  name='code'
                  required
                  placeholder='e.g. 248 CMR 10.05'
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.code && formik.errors.code && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.code}
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='title'>
                  Title <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='title'
                  name='title'
                  required
                  placeholder='e.g. Traps and Cleanouts'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.title}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='description'>
                  Description <span style={{ color: "red" }}>*</span>
                </label>
                <Editor
                  value={formik.values.description}
                  onChange={(content) => formik.setFieldValue("description", content)}
                  placeholder='Official code description...'
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

            {/* Exception */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='exception'>Exception (Optional)</label>
                <Editor
                  value={formik.values.exception}
                  onChange={(content) => formik.setFieldValue("exception", content)}
                  placeholder='Code exceptions if any...'
                />
              </div>
            </div>

            {/* Plain Language Interpretation */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='plainLanguageInterpretation'>
                  Plain Language Interpretation <span style={{ color: "red" }}>*</span>
                </label>
                <Editor
                  value={formik.values.plainLanguageInterpretation}
                  onChange={(content) => formik.setFieldValue("plainLanguageInterpretation", content)}
                  placeholder='Simplified explanation...'
                />
                {formik.touched.plainLanguageInterpretation && formik.errors.plainLanguageInterpretation && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.plainLanguageInterpretation}
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
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(EditPlumbingCode, ["admin"]);
