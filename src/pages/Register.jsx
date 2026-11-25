import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Register() {
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      // FormData عشان الـ avatar ملف (نفس form-data في Postman)
      await api.register(new FormData(e.target));
      nav("/login");
    } catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  }
  return (
    <form className="panel narrow" onSubmit={submit}>
      <h1>Create account</h1>
      <div className="two">
        <label>First name<input name="first_name" required /></label>
        <label>Last name<input name="last_name" required /></label>
      </div>
      <label>Email<input name="email" type="email" required /></label>
      <label>Password<input name="password" type="password" required /></label>
      <label>Avatar<input name="avatar" type="file" accept="image/*" /></label>
      {err && <p className="error">{err}</p>}
      <button disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
    </form>
  );
}
