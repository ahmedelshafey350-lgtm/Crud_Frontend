import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try { await login(f.email, f.password); nav("/courses"); }
    catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  }
  return (
    <form className="panel narrow" onSubmit={submit}>
      <h1>Log in</h1>
      <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
      {err && <p className="error">{err}</p>}
      <button disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
    </form>
  );
}
