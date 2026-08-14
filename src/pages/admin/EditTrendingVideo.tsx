import React from "react";
import { useEditTrendingVideo } from "./useEditTrendingVideo";
import form from "../../components/UI/form/formcus.module.scss";
import Input from "../../components/UI/input/Input";
import withRole from "../withRole";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";

function EditTrendingVideo() {
  const {
    navigate,
    fileInputRef,
    loading,
    submitting,
    thumbnailPreview,
    formik,
    handleThumbnailChange,
    audience,
  } = useEditTrendingVideo();

  const DEFAULT_IMAGE = "/no_image.png";
  const formattedAudience = audience === "licensed-plumber" ? "Licensed Plumber" : "Apprentice";

  return (
    <div
      id='edittrendingvideo'
      className={`${form.myprofilewrapper} dashboard-card-global edit-profile-wrap`}
    >
      {loading ? <LoadingSpinner /> : null}

      <div className='profile-card'>
        {/* Header */}
        <div className='gc-profile-flex'>
          <h2>Edit Trending Video ({formattedAudience})</h2>
          <button
            type='button'
            onClick={() => navigate(`/admin/trending-videos/${audience}`)}
            className='custom-button gc-back-btn mtop-0'
          >
            Back
          </button>
        </div>

        {/* Thumbnail Upload */}
        <div className='profile-picture-upload'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleThumbnailChange}
            style={{ display: "none" }}
          />
          <div
            className='image-preview-wrap'
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={thumbnailPreview || DEFAULT_IMAGE}
              alt='Trending Video Thumbnail'
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
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='title'>
                  Video Title <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='title'
                  name='title'
                  required
                  placeholder='e.g. How to flush your water heater'
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

            {/* Video URL */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='videoUrl'>
                  Video URL <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='videoUrl'
                  name='videoUrl'
                  required
                  placeholder='e.g. https://www.youtube.com/watch?v=...'
                  value={formik.values.videoUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.videoUrl && formik.errors.videoUrl && (
                  <div className='error' style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                    {formik.errors.videoUrl}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={form.profileformcol} style={{ width: "100%", flex: "1 0 100%" }}>
              <div className='formgrp'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  name='description'
                  placeholder='Brief description of the video...'
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
          <div className='submitbtnwrap' style={{ marginTop: "30px" }}>
            <button
              type='submit'
              className={`custom-button w-auto`}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Update Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withRole(EditTrendingVideo, ["admin"]);
