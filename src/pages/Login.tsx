/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { auth } from "../auth";
import type { User } from "../types/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated()) navigate("/users", { replace: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.get<User[]>("/users");
      const user = res.data.find(u => u.userName === username && u.password === password);

      if (!user) {
        toast.error("Invalid credentials", { position: "top-right" });
        return;
      }

      auth.setToken("mock-jwt-token");
      navigate("/users", { replace: true });
    } catch {
      toast.error("Login failed", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h2>KCB Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              className={styles.inputField}
              placeholder=" "
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <label className={styles.inputLabel}>Username</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              className={styles.inputField}
              placeholder=" "
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label className={styles.inputLabel}>Password</label>
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Login;
