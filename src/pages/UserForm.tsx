import React, { useState } from "react";
import api from "../api";
import type { User } from "../types/user";
import styles from "../styles/Users.module.css";

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
  onSave: (user: User, isNew: boolean) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave }) => {
  const [username, setUsername] = useState(user?.userName || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (user) {
        // Update
        const res = await api.put<User>(`/users/${user.id}`, { userName: username, firstName, lastName, email, password });
        onSave(res.data, false);
      } else {
        // Create
        const res = await api.post<User>("/users", { userName: username, firstName, lastName, email, password });
        onSave(res.data, true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["modal"]}>
      <h3>{user ? "Edit User" : "Add User"}</h3>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles["user-form"]} onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className={styles["form-actions"]}>
          <button className={styles["save-btn"]} type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className={styles["cancel-btn"]} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
