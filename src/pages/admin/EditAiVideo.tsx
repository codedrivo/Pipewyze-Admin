import React from "react";
import { useEditAiVideo } from "./useEditAiVideo";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import withRole from "../withRole";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";

function EditAiVideo() {
  const {
    navigate,
    loading,
    submitting,
    fileInputRef,
    thumbnailPreview,
    formik,
    handleThumbnailChange,
  } = useEditAiVideo();

  const DEFAULT_IMAGE = "/no_image.png";

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      id="editaivideo"
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      <div className="profile-card">
        {/* Header */}
        <div className="gc-profile-flex">
          <h2>Edit AI Video</h2>
          <button
            type="button"
            onClick={() => navigate("/admin/ai-videos")}
            className="custom-button gc-back-btn mtop-0"
          >
            Back
          </button>
        </div>

        {/* Thumbnail Upload */}
        <div className="profile-picture-upload">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            style={{ display: "none" }}
          />
          <div
            className="image-preview-wrap"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={thumbnailPreview || DEFAULT_IMAGE}
              alt="Video Thumbnail"
              className="image-preview-img"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />
            <div className="image-edit-overlay">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="formadduser from-fix-global-wrap"
          autoComplete="off"
        >
          <div className={`${form.profileform} from-fix-global`}>
            
            {/* Question Text */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className="formgrp">
                <label htmlFor="question">
                  Question <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type="text"
                  id="question"
                  name="question"
                  required
                  placeholder="e.g. How to install a sink tap?"
                  value={formik.values.question}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.question && formik.errors.question && (
                  <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {formik.errors.question}
                  </div>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className="formgrp">
                <label htmlFor="targetAudience">
                  Target Audience <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={formik.values.targetAudience}
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
                    height: "50px",
                  }}
                >
                  <option value="apprentice">Apprentice</option>
                  <option value="licensed-plumber">Licensed Plumber</option>
                  <option value="home-owner">Home Owner</option>
                </select>
                {formik.touched.targetAudience && formik.errors.targetAudience && (
                  <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {formik.errors.targetAudience}
                  </div>
                )}
              </div>
            </div>

            {/* Video Title */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className="formgrp">
                <label htmlFor="title">
                  Video Title <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Setting up a new P-trap"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {formik.errors.title}
                  </div>
                )}
              </div>
            </div>

            {/* Video URL */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className="formgrp">
                <label htmlFor="videoUrl">
                  Video URL <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={formik.values.videoUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.videoUrl && formik.errors.videoUrl && (
                  <div className="error" style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {formik.errors.videoUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className="formgrp">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the video..."
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
              </div>
            </div>

          </div>

          {/* Submit Actions */}
          <div className="submitbtnwrap" style={{ marginTop: "30px" }}>
            <button
              type="submit"
              className="custom-button w-auto"
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

export default withRole(EditAiVideo, ["admin"]);
