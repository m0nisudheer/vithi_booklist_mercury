'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../input.css";

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      userName: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const mutation = `
        mutation SignUp($signUpData: signUpInput!) {
          signUp(signUpData: $signUpData) {
            id
            msg
            role
          }
        }
      `;

      const variables = {
        signUpData: {
          email: values.email,
          userName: values.userName,
          password: values.password,
        },
      };

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: mutation,
            variables,
          }),
        });

        const result = await response.json();

        if (response.ok && result.data.signUp) {
          toast.success("User Registered Successfully", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            className: "border border-green-500",
          });
          formik.resetForm();
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          // Use specific error messages returned from the server
          const errorMsg = result.errors && result.errors[0] 
            ? result.errors[0].message 
            : "An unknown error occurred";
          
          // Display the specific error messages in a toast
          toast.error(`Registration Failed: ${errorMsg}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            className: "border border-red-500",
          });
        }
      } catch (error) {
        toast.error("Network error: " + error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          className: "border border-red-500",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2 className="form-heading">Sign Up</h2>

        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`input-field ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-text">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="userName" className="form-label">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`input-field ${
                formik.touched.userName && formik.errors.userName
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Enter your username"
            />
            {formik.touched.userName && formik.errors.userName && (
              <div className="error-text">{formik.errors.userName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`input-field ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error-text">{formik.errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className={`submit-button ${
                formik.isSubmitting || loading ? "disabled-button" : ""
              }`}
              disabled={formik.isSubmitting || loading}
            >
              {formik.isSubmitting || loading ? "Please wait..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <a href="/login" className="link-text">
            Login
          </a>
        </p>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default SignUp;


