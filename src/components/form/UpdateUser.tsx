import { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { formatUSPhoneNumber, useAddUser } from "./useAddUser";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import { userDetails } from "../../service/apis/user.api";

const UpdateUser = () => {
  const params = useParams();
  const location = useLocation();
  const { id } = params;
  const { addUserFormik, loading } = useAddUser(id);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserPhone = (data: any): string => {
    const seen = new Set<any>();
    const queue = [data];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current || typeof current !== "object" || seen.has(current)) {
        continue;
      }

      seen.add(current);

      for (const [key, value] of Object.entries(current)) {
        const normalizedKey = key.toLowerCase();
        if (
          (normalizedKey.includes("phone") ||
            normalizedKey.includes("mobile") ||
            normalizedKey.includes("telephone")) &&
          typeof value === "string" &&
          value.trim() !== ""
        ) {
          return value;
        }

        if (value && typeof value === "object") {
          queue.push(value);
        }
      }
    }

    return "";
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const userData = await userDetails(id);
          const payload = userData?.userData ?? userData?.user ?? userData;
          if (payload) {
            addUserFormik.setValues({
              firstName: payload?.firstName || "",
              lastName: payload?.lastName || "",
              email: payload?.email || "",
              phoneNumber: formatUSPhoneNumber(getUserPhone(payload)),
              profileImage: payload?.profileimageurl || "",
              role: payload?.role || "",
              password: "",
              // keep the current avatar value so submit state stays consistent
            });
            setImagePreview(payload?.profileimageurl || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();
    } else {
      setImagePreview("/default_profile.png");
    }
  }, [id]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addUserFormik.setFieldValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatUSPhoneNumber(e.target.value);
    addUserFormik.setFieldValue("phoneNumber", formattedPhoneNumber);
  };

  return (
    <div
      id='editprofile'
      className={`${form.myprofilewrapper} dashboard-card-global`}
    >
      <div className='profile-card'>
        <div className={form.profile_flex}>
          <h2>{id ? "Update User" : "Add User"}</h2>
          <Link
            to='/admin/users'
            state={{ fromPage: location.state?.fromPage }}
          >
            <button className='custom-button mtop-0'>Back</button>
          </Link>
        </div>

        <form
          onSubmit={addUserFormik.handleSubmit}
          autoComplete='off'
          className='formadduser from-fix-global-wrap'
        >
          <div className={`${form.profileform}  from-fix-global`}>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='firstName'
                  placeholder={"Enter your first name"}
                  name='firstName'
                  onChange={addUserFormik.handleChange}
                  onBlur={addUserFormik.handleBlur}
                  value={addUserFormik.values.firstName}
                />
                {addUserFormik.touched.firstName &&
                  addUserFormik.errors.firstName && (
                    <div className='error'>
                      {addUserFormik.errors.firstName}
                    </div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='lastName'
                  placeholder={"Enter your last name"}
                  name='lastName'
                  onChange={addUserFormik.handleChange}
                  onBlur={addUserFormik.handleBlur}
                  value={addUserFormik.values.lastName}
                />
                {addUserFormik.touched.lastName &&
                  addUserFormik.errors.lastName && (
                    <div className='error'>{addUserFormik.errors.lastName}</div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Email <span style={{ color: "red" }}>*</span>
                </label>
                {id ? (
                  <Input
                    classes='passwordlabel'
                    type='text'
                    id='email'
                    name='email'
                    value={addUserFormik.values.email}
                    disabled
                  />
                ) : (
                  <Input
                    classes='passwordlabel'
                    type='text'
                    id='email'
                    placeholder={"Enter your email address"}
                    name='email'
                    onChange={addUserFormik.handleChange}
                    value={addUserFormik.values.email}
                  />
                )}
                {addUserFormik.touched.email && addUserFormik.errors.email && (
                  <div className='error'>{addUserFormik.errors.email}</div>
                )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='phoneNumber'>
                  Phone Number <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='phoneNumber'
                  placeholder={"(555) 123-4567"}
                  name='phoneNumber'
                  onChange={handlePhoneNumberChange}
                  value={addUserFormik.values.phoneNumber}
                  maxLength={14}
                />
                {addUserFormik.touched.phoneNumber &&
                  addUserFormik.errors.phoneNumber && (
                    <div className='error'>
                      {addUserFormik.errors.phoneNumber}
                    </div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label>
                  Role <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name='role'
                  value={addUserFormik.values.role}
                  onChange={addUserFormik.handleChange}
                >
                  <option value=''>Select</option>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
                {addUserFormik.touched.role && addUserFormik.errors.role && (
                  <div className='error'>{addUserFormik.errors.role}</div>
                )}
              </div>
            </div>

            {id === undefined && (
              <div className={form.profileformcol}>
                <div className='formgrp'>
                  <label htmlFor='password'>
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    classes='passwordlabel updateUser'
                    type={isPasswordVisible ? "text" : "password"}
                    id='password'
                    placeholder={"Enter your password"}
                    name='password'
                    onChange={addUserFormik.handleChange}
                    value={addUserFormik.values.password}
                    autoComplete='new-password'
                    rightIcon={
                      <FontAwesomeIcon
                        icon={isPasswordVisible ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          bottom: "10px",
                          transform: "translateY(-50%)",
                          right: "15px",
                        }}
                      />
                    }
                  />
                  {addUserFormik.touched.password &&
                    addUserFormik.errors.password && (
                      <div className='error'>
                        {addUserFormik.errors.password}
                      </div>
                    )}
                </div>
              </div>
            )}

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label>Profile Image</label>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type='file'
                  id='profileImage'
                  name='profileImage'
                  accept='image/*'
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                {/* Clickable avatar with edit overlay */}
                <div
                  className='image-preview-wrap'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={imagePreview || "/default_profile.png"}
                    alt='Profile'
                    className='image-preview-img'
                    onError={(e) => {
                      e.currentTarget.src = "/default_profile.png";
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
                {addUserFormik.touched.profileImage &&
                  addUserFormik.errors.profileImage && (
                    <div className='error'>
                      {addUserFormik.errors.profileImage}
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
              <button className='custom-button submit-btn'>Save</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
