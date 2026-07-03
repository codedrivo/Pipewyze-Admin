import * as yup from "yup";

const commonEmailDomainTypos = new Set([
  "gmail.co",
  "gmail.con",
  "gmai.com",
  "gmial.com",
  "gmail.cm",
  "yahooo.com",
  "hotnail.com",
  "hotmial.com",
  "outloook.com",
]);

// Email validation
export const emailSchema = yup
  .string()
  .trim()
  .required("Email address is required")
  .email("Please enter a valid email address")
  .test(
    "common-email-domain-typos",
    "Invalid email domain. Did you mean @gmail.com?",
    (value) => {
      if (!value) return false;
      const domain = value.split("@")[1]?.toLowerCase();
      if (!domain) return false;
      return !commonEmailDomainTypos.has(domain);
    }
  )
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Please enter a valid email (e.g., user@gmail.com)"
  )
  .max(100, "Email is too long");

export const signInEmailSchema = yup
  .string()
  .trim()
  .required("Email address is required")
  .email("Please enter a valid email address")
  .max(100, "Email is too long");

export const otpValidationSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "Please enter a valid 6-digit OTP"),
});
