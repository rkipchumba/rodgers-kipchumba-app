import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { auth } from "../auth";
import type { User } from "../types/user";
import UserForm from "./UserForm";
import styles from "../styles/Users.module.css";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = query ? { userName: query } : {};
      const res = await api.get<User[]>("/users", { params });
      setUsers(res.data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete user");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const handleFormSave = (user: User, isNew: boolean) => {
    if (isNew) setUsers(prev => [...prev, user]);
    else setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
    handleFormClose();
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles["users-container"]}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Users</h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#004d4d",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div className={styles["users-actions"]}>
        <input
          placeholder="Search by username"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles["search-btn"]} onClick={() => fetchUsers(search)}>Search</button>
        <button className={styles["add-btn"]} onClick={() => setShowForm(true)}>Add New User</button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className={styles["users-table"]}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.userName}</td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <button className={styles["edit-btn"]} onClick={() => handleEdit(u)}>Edit</button>
                  <button className={styles["delete-btn"]} onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default UsersList;
