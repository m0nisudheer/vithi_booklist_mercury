"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FormTable from "../../container/form";
import { FaBars } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import "../../../input.css"

const Navbar = () => {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("role");
      const storedUsername = sessionStorage.getItem("userName");
      setRole(storedRole);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleOptionSelect = (option) => {
    if (option === "addBook") {
      setIsFormOpen(true);
    } else if (option === "logout") {
      handleLogout();
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IoBookSharp size={40} className="text-red-500" />
          </div>

          <div className="flex-grow text-center">
            <span className="text-lg font-bold text-red-500">
              Welcome, {username || "Guest"}..!
            </span>
            {role && (
              <div className="text-xs text-white">
                Logged in as{" "}
                <strong>{role === "ADMIN" ? "Admin" : "User"}</strong>
              </div>
            )}
          </div>

          <div className="relative hidden md:flex items-center space-x-4">
            {role === "ADMIN" && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="table-button" >
                Add Book
              </button>
            )}
            <button
              onClick={handleLogout}
              className="table-button" >
              Logout
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={handleMenuToggle} className="text-white">
              <FaBars size={24} />
            </button>

            {isMenuOpen && (
              <div className="menu">
                {role === "ADMIN" && (
                  <button
                    onClick={() => handleOptionSelect("addBook")}
                    className="menu-button"
                  >
                    Add Book
                  </button>
                )}
                <button
                  onClick={() => handleOptionSelect("logout")}
                  className="menu-button" >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isFormOpen && <FormTable onClose={() => setIsFormOpen(false)} />}
    </>
  );
};

export default Navbar;