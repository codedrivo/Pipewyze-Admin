import React, { useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import formStyle from "../form/formcus.module.scss";
import styles from "./AddService.module.scss";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import Input from "../UI/input/Input";
import Button from "../UI/button/Button";
import Editor from "../common/Editor";
import { useUpdateService } from "./useUpdateService";

const DEFAULT_SERVICE_IMAGE = "/no_image.png";

const UpdateServiceForm = () => {
  const { id } = useParams();
  const { formik, loading, plans } = useUpdateService(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      formik.setFieldValue("image", e.target.files[0]);
    }
  };

  const getPreviewImage = () => {
    if (formik.values.image instanceof File) {
      return URL.createObjectURL(formik.values.image);
    }

    if (typeof formik.values.image === "string" && formik.values.image) {
      return formik.values.image;
    }

    return DEFAULT_SERVICE_IMAGE;
  };

  return (
    <div
      id='editprofile'
      className={`${formStyle.myprofilewrapper} dashboard-card-global`}
    >
      <div className='profile-card'>
        <div className={formStyle.profile_flex}>
          <h2>Update Service</h2>
          <Link
            to='/admin/services'
            state={{ fromPage: location.state?.fromPage }}
          >
            <button className='custom-button mtop-0'>Back</button>
          </Link>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          autoComplete='off'
          className='formadduser from-fix-global-wrap'
        >
          <div className={`${formStyle.profileform} from-fix-global`}>
            <div
              className={`${formStyle.profileformcol} ${styles.fullWidthField}`}
            >
              <div className='formgrp'>
                <label htmlFor='image'>Service Image</label>
                <div
                  className={styles.clickableArea}
                  onClick={handleImageClick}
                  role='button'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleImageClick();
                    }
                  }}
                >
                  <img
                    src={getPreviewImage()}
                    alt='Service'
                    className={styles.previewImage}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_SERVICE_IMAGE;
                    }}
                  />
                  <p className={styles.uploadText}>Click to upload image</p>
                </div>
                <input
                  id='image'
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  className={styles.hiddenInput}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className={formStyle.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='name'>
                  Service Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  id='name'
                  name='name'
                  type='text'
                  placeholder='e.g., Premium Grave Care'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.name && formik.errors.name
                      ? (formik.errors.name as string)
                      : ""
                  }
                />
              </div>
            </div>

            <div className={formStyle.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='price'>
                  Price <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  id='price'
                  name='price'
                  type='number'
                  placeholder='e.g., 199.99'
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.price && formik.errors.price
                      ? (formik.errors.price as string)
                      : ""
                  }
                />
              </div>
            </div>

            <div className={formStyle.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='yearlyPrice'>Yearly Price</label>
                <Input
                  type='text'
                  id='yearlyPrice'
                  name='yearlyPrice'
                  placeholder='e.g., 199.99'
                  value={formik.values.yearlyPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.yearlyPrice && formik.errors.yearlyPrice
                      ? (formik.errors.yearlyPrice as string)
                      : ""
                  }
                />
              </div>
            </div>

            <div className={formStyle.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='estimatedTime'>Estimated Time</label>
                <Input
                  classes='passwordlabel'
                  id='estimatedTime'
                  name='estimatedTime'
                  type='text'
                  placeholder='e.g., 2-3 hours'
                  value={formik.values.estimatedTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            <div
              className={`${formStyle.profileformcol} ${styles.fullWidthField}`}
            >
              <div className='formgrp'>
                <label htmlFor='features'>Features (Comma separated)</label>
                <Input
                  classes='passwordlabel'
                  id='features'
                  name='features'
                  type='text'
                  placeholder='e.g., Deep cleaning, Polishing, Flower arrangement'
                  value={formik.values.features}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            <div
              className={`${formStyle.profileformcol} ${styles.fullWidthField}`}
            >
              <div className='formgrp'>
                <label className={styles.customLabel}>Overview</label>
                <div className={styles.editorField}>
                  <Editor
                    value={formik.values.overview}
                    onChange={(content: string) =>
                      formik.setFieldValue("overview", content)
                    }
                  />
                </div>
              </div>
            </div>

            <div
              className={`${formStyle.profileformcol} ${styles.fullWidthField}`}
            >
              <div className='formgrp'>
                <label className={styles.customLabel}>What We Will Do</label>
                <div className={styles.editorField}>
                  <Editor
                    value={formik.values.whatWeWillDo}
                    onChange={(content: string) =>
                      formik.setFieldValue("whatWeWillDo", content)
                    }
                  />
                </div>
              </div>
            </div>

            <div
              className={`${formStyle.profileformcol} ${styles.fullWidthField}`}
            >
              <div className='formgrp'>
                <label className={styles.customLabel}>
                  What We Need From You
                </label>
                <div className={styles.editorField}>
                  <Editor
                    value={formik.values.whatWeNeedFromYou}
                    onChange={(content: string) =>
                      formik.setFieldValue("whatWeNeedFromYou", content)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div
              className={`${styles.submitWrapper} text-end`}
            >
              <Button type='submit' disabled={loading}>
                {loading ? "Updating..." : "Update Service"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateServiceForm;
