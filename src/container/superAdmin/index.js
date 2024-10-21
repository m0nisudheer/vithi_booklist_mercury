"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../input.css"; 

const SuperAdmin = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const toastId = toast.info("Adding Admin...", {
        position: "top-center",
        autoClose: false,
        isLoading: true,
        className: "border border-orange-500", 
      });

      const mutation = `
        mutation {
          addSuperAdminEmail(email: "${values.email}") {
            msg
            email
          }
        }
      `;

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: mutation }),
        });

        const result = await response.json();

        if (response.ok && result?.data?.addSuperAdminEmail) {
          toast.update(toastId, {
            render: `Admin added successfully: ${result.data.addSuperAdminEmail.email}`,
            type: "success",
            autoClose: 2000,
            isLoading: false,
            className: "border border-green-500",
          });

          formik.resetForm();
        } else {
          const errorMsg = result.errors ? result.errors[0].message : "An unknown error occurred";
          toast.update(toastId, {
            render: errorMsg,
            type: "error",
            autoClose: 2000,
            isLoading: false,
            className: "border border-red-500",
          });
        }
      } catch (error) {
        const errorMessage = "Network error: " + error.message;
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          autoClose: 2000,
          isLoading: false,
          className: "border border-red-500",
        });
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2 className="form-heading">Super Admin Dashboard</h2>

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
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter admin email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-text">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className={`submit-button ${formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Please wait..." : "Add"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Want to log in?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
            {" "}or just{" "}
            <button
              className="text-green-500 hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </p>
        </div>
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

export default SuperAdmin;
