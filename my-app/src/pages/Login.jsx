import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../api/Api";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../img/8916beee-6eac-4165-b2bd-8a750ddf8a3e.png";
//import logo from "../img/0200dc61-1c7a-4ad6-bf31-7ab2532d179b.png";

export default function Login() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token);
      navigate("/albums");
    }
  }, [searchParams, login, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
    // window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#e4e4fc" }}>
      <div className="card border-1 p-5 text-center" style={{ width: "400px" }}>
        <img
          src={logo}
          alt="kaviosPix"
          className="mx-auto d-block mb-4"
          style={{ height: "150px", objectFit: "contain" }}
        />

        <p className="text-muted mb-4">Store and organize your memories.</p>

        <button className="btn btn-outline-primary" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
