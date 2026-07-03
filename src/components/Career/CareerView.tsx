import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "../form/formcus.module.scss";
import { useCareerUser } from "./UseCareerAdd";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { Link, useLocation, useParams } from "react-router-dom";
import { CareerDetails } from "../../service/apis/carrer.api";

const CareerView = () => {
  const params = useParams();
  const location = useLocation();
  const { id } = params;
  const { addCareerFormik, loading } = useCareerUser(id);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const CareerData = await CareerDetails(id);
          console.log(CareerData.careerData);
          if (CareerData.status === 200) {
            addCareerFormik.setValues({
              careername: CareerData.careerData?.careerName || "",
              careerlogo: CareerData.careerData?.careerLogo || "",
            });
            setImagePreview(CareerData.careerData?.careerLogo || "");
          }
        } catch (error) {
          console.error("Error fetching career data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

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
  if (isLoading) {
    return <LoadingSpinner />; 
  }
  return (
    <div id='editprofile' className={`${form.myprofilewrapper} dashboard-card-global`}>
      <div className='profile-card'>
        <div className={form.profile_flex}>
          <h2>{"Update Career"}</h2>
          <Link
            to="/admin/career"
            state={{ fromPage: location.state?.fromPage }}
          >
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
                  Carrer Name <span style={{ color: "red" }}>*</span>
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
                  <div className='image-preview mt-20'>
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

export default CareerView;
