import { useState } from "react";

const lines = (a) => (a || []).join("\n");
const toArr = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const empty = {
  title: "", description: "", category: "", level: "Beginner", price: 0, duration: "",
  language: "English", instructorName: "", instructorExp: "", thumbnail: "",
  isPublished: true, prerequisites: "", whatYouWillLearn: "", requirements: "",
};

export default function CourseForm({ course, onSave, onCancel }) {
  const [f, setF] = useState(
    course
      ? { ...empty, ...course, instructorName: course.instructor?.name || "", instructorExp: course.instructor?.experience || "",
          prerequisites: lines(course.prerequisites), whatYouWillLearn: lines(course.whatYouWillLearn), requirements: lines(course.requirements) }
      : empty
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await onSave({
        title: f.title, description: f.description, category: f.category, level: f.level,
        price: Number(f.price), duration: f.duration, language: f.language,
        instructor: { name: f.instructorName, experience: f.instructorExp },
        prerequisites: toArr(f.prerequisites), whatYouWillLearn: toArr(f.whatYouWillLearn),
        requirements: toArr(f.requirements), thumbnail: f.thumbnail, isPublished: f.isPublished,
      });
    } catch (x) { setErr(x.message); setBusy(false); }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>{course ? "Edit course" : "New course"}</h2>
      <label>Title<input required value={f.title} onChange={set("title")} /></label>
      <label>Description<textarea rows="2" required value={f.description} onChange={set("description")} /></label>
      <div className="two">
        <label>Category<input value={f.category} onChange={set("category")} /></label>
        <label>Level
          <select value={f.level} onChange={set("level")}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </label>
        <label>Price (USD)<input type="number" min="0" value={f.price} onChange={set("price")} /></label>
        <label>Duration<input value={f.duration} onChange={set("duration")} placeholder="40 Hours" /></label>
        <label>Language<input value={f.language} onChange={set("language")} /></label>
        <label>Thumbnail URL<input value={f.thumbnail} onChange={set("thumbnail")} /></label>
        <label>Instructor name<input value={f.instructorName} onChange={set("instructorName")} /></label>
        <label>Instructor experience<input value={f.instructorExp} onChange={set("instructorExp")} /></label>
      </div>
      <div className="two">
        <label>What you will learn (one per line)<textarea rows="4" value={f.whatYouWillLearn} onChange={set("whatYouWillLearn")} /></label>
        <label>Requirements (one per line)<textarea rows="4" value={f.requirements} onChange={set("requirements")} /></label>
      </div>
      <label>Prerequisites (one per line)<textarea rows="2" value={f.prerequisites} onChange={set("prerequisites")} /></label>
      <label className="check"><input type="checkbox" checked={f.isPublished} onChange={set("isPublished")} /> Published</label>
      {err && <p className="error">{err}</p>}
      <div className="row">
        <button disabled={busy}>{busy ? "Saving…" : "Save course"}</button>
        <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
