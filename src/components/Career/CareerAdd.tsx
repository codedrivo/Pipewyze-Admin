import { useState } from "react";
import Input from "../UI/input/Input";
import form from "../form/formcus.module.scss";
import { useCareerUser } from "./UseCareerAdd";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const CarrerAdd = () => {
  const params = useParams();
  const { id } = params;
  const { addCareerFormik, loading } = useCareerUser(id);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      addCareerFormik.setFieldValue("careerlogo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id='editprofile' className={`${form.myprofilewrapper} dashboard-card-global`}>
      <div className='profile-card'>
        <div className={form.profile_flex}>
          <h2>{"Add Career"}</h2>
          <Link to='/admin/career'>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form
          onSubmit={addCareerFormik.handleSubmit}
          autoComplete='off'
          className='formadduser from-fix-global-wrap'
        >
          <div className={`${form.profileform}  from-fix-global`}>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Career Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='careername'
                  placeholder={"Enter your career name"}
                  name='careername'
                  onChange={addCareerFormik.handleChange}
                  value={addCareerFormik.values.careername}
                />
                {addCareerFormik.touched.careername &&
                  addCareerFormik.errors.careername && (
                    <div className='error'>{addCareerFormik.errors.careername}</div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='profileImage'>Career Logo<span style={{ color: "red" }}>*</span></label>
                <input
                  type='file'
                  id='careerlogo'
                  name='careerlogo'
                  onChange={handleImageChange}
                />
                {addCareerFormik.touched.careerlogo &&
                  addCareerFormik.errors.careerlogo && (
                    <div className='error'>
                      {addCareerFormik.errors.careerlogo as string}
                    </div>
                )}
                {imagePreview && (
                  <div className='image-preview'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      width={100}
                      height={100}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={`submit-btn-wrap`}>
              {" "}
              <button className="custom-button submit-btn">Save</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CarrerAdd;
