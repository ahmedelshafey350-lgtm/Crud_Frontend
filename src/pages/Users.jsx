import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Users() {
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { api.users().then(setUsers).catch((e) => setErr(e.message)); }, []);

  if (err) return <p className="error">{err}</p>;
  if (!users) return <p className="empty">Loading users…</p>;
  if (!users.length) return <p className="empty">No users yet.</p>;
  return (
    <>
      <h1>Users</h1>
      <ul className="users">
        {users.map((u) => (
          <li key={u._id || u.id || u.email}>
            <span className="avatar">{(u.first_name?.[0] || "?").toUpperCase()}</span>
            <div><strong>{u.first_name} {u.last_name}</strong><small>{u.email}</small></div>
          </li>
        ))}
      </ul>
    </>
  );
}
