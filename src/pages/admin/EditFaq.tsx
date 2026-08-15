import React from "react";
import { useEditFaq } from "./useEditFaq";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import Editor from "../../components/common/Editor";

function EditFaq() {
  const { navigate, formik, loading, saving } = useEditFaq();

  return (
    <div
      id='editprofile'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <style>{`
        .full-width-col {
          width: 100% !important;
          flex: 1 0 100% !important;
        }
      `}</style>
      <div className='profile-card'>
        {loading ? <LoadingSpinner /> : null}

        {/* Header */}
        <div className='gc-profile-flex'>
          <h2>Edit FAQ</h2>
          <button
            type='button'
            onClick={() => navigate("/admin/faqs")}
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
            {/* Question */}
            <div className={`${form.profileformcol} full-width-col`}>
              <div className='formgrp'>
                <label htmlFor='question'>
                  Question <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='question'
                  name='question'
                  required
                  placeholder='e.g. How do I update my profile details?'
                  value={formik.values.question}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.question && formik.errors.question && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.question}
                  </div>
                )}
              </div>
            </div>

            {/* Answer */}
            <div className={`${form.profileformcol} full-width-col`}>
              <div className='formgrp'>
                <label htmlFor='answer'>
                  Answer <span style={{ color: "red" }}>*</span>
                </label>
                <Editor
                  value={formik.values.answer}
                  onChange={(content) => formik.setFieldValue("answer", content)}
                  placeholder='Enter FAQ answer here...'
                />
                {formik.touched.answer && formik.errors.answer && (
                  <div
                    className='error'
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {formik.errors.answer}
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
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(EditFaq, ["admin"]);
