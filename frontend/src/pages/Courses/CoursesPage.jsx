import React, { useState, useEffect } from "react";
import API from "../../api/api";
import Tag from "../../components/common/Tag";

export default function CoursesPage({ setPage, setActiveCourse }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [courses, setCourses] = useState([]);

  const categories = [
    "All",
    "Web Dev",
    "Database",
    "AI/ML",
    "CS Fundamentals",
    "Cloud",
    "Design",
    "Security",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      (filter === "All" || c.category === filter) &&
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <h1 style={{ marginBottom: 4 }}>
          Course <span style={{ color: 'var(--primary)' }}>Library</span>
        </h1>
        <div style={{ color: "var(--text-secondary)", fontSize: 16 }}>
          {courses.length} courses available to elevate your skills
        </div>
      </div>

      <div className="search-bar mb-16" style={{ width: "100%", maxWidth: 540, marginBottom: 24 }}>
        <span style={{ color: "var(--text-muted)" }}>
           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
        </span>
        <input
          style={{marginLeft: 12, fontSize: 15, width: '100%'}}
          placeholder="What do you want to learn today?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar" style={{display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap'}}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`action-tab ${filter === cat ? "active" : ""}`}
            style={{
              padding: '8px 20px', 
              borderRadius: '24px', 
              border: filter === cat ? 'none' : '1px solid var(--border)', 
              cursor: 'pointer', 
              fontSize: 14, 
              fontWeight: 600,
              background: filter === cat ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'var(--surface-solid)', 
              color: filter === cat ? 'white' : 'var(--text-secondary)',
              boxShadow: filter === cat ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="course-grid">
        {filtered.length === 0 && <div className="text-muted" style={{fontSize: 15, padding: 24, textAlign: 'center', width: '100%'}}>No courses match your criteria.</div>}
        {filtered.map((c, i) => (
          <div
            key={c._id}
            className="course-card card fade-up"
            style={{ animationDelay: `${i * 0.1}s`, border: 'none', background: 'var(--surface-solid)' }}
            onClick={() => {
              setActiveCourse(c);
              setPage("course-detail");
            }}
          >
            <div className="course-image-container">
              <img src={c.image} alt={c.title} className="course-image" />
            </div>
            <div className="course-content">
              <div className="course-badge">{c.category}</div>
              <div className="course-title" style={{fontWeight: 700, fontSize: 20}}>{c.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16, fontWeight: 500 }}>
                by {c.instructor?.name || "Instructor"}
              </div>

              <div className="course-description" style={{color: 'var(--text-secondary)'}}>{c.description}</div>

              <div className="course-footer" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", borderTop: '1px solid var(--border)', paddingTop: 16}}>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>${Number(c.price).toFixed(2)}</span>
                <button className="btn btn-primary" style={{padding: '8px 16px', borderRadius: '8px', fontSize: 13}}>Enrol Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}