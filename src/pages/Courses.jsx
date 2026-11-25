import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import CourseForm from "../components/CourseForm.jsx";

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [editing, setEditing] = useState(null); // null | "new" | course
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const load = () => api.courses().then(setCourses).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const shown = useMemo(
    () => (courses || []).filter((c) => `${c.title} ${c.category}`.toLowerCase().includes(q.toLowerCase())),
    [courses, q]
  );

  async function save(data) {
    if (editing === "new") await api.createCourse(data);
    else await api.updateCourse(editing._id, data);
    setEditing(null);
    load();
  }
  async function remove(c) {
    if (!confirm(`Delete "${c.title}"?`)) return;
    try { await api.deleteCourse(c._id); load(); } catch (e) { setErr(e.message); }
  }

  if (editing) return <CourseForm course={editing === "new" ? null : editing} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <>
      <div className="head">
        <h1>Courses</h1>
        <input className="search" placeholder="Search by title or category" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={() => setEditing("new")}>New course</button>
      </div>
      {err && <p className="error">{err}</p>}
      {!courses ? <p className="empty">Loading courses…</p>
        : !shown.length ? <p className="empty">No courses found. Add your first one.</p>
        : (
          <div className="grid">
            {shown.map((c) => (
              <article className="course" key={c._id}>
                {c.thumbnail && <img src={c.thumbnail} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />}
                <div className="body">
                  <span className={`tag ${c.isPublished ? "on" : ""}`}>{c.isPublished ? "Published" : "Draft"}</span>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <small>{c.category} · {c.level} · {c.duration} · {c.instructor?.name}</small>
                  <div className="foot">
                    <strong>${c.price}</strong>
                    <span>
                      <button className="ghost" onClick={() => setEditing(c)}>Edit</button>
                      <button className="danger" onClick={() => remove(c)}>Delete</button>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
    </>
  );
}
