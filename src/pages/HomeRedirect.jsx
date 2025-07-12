// frontend/src/pages/HomeRedirect.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomeRedirect = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        const role = res.data?.role;
        if (role === "admin") navigate("/admin");
        else if (role === "student") navigate("/student");
        else navigate("/login");
      } catch {
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  return checking ? (
    <div className="min-h-screen flex items-center justify-center">Checking auth...</div>
  ) : null;
};

export default HomeRedirect;
