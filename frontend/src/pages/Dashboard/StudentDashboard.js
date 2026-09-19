import React, { useState, useEffect } from "react";
import API from "../../api/api";
import Avatar from "../../components/common/Avatar";
import { socket } from "../../socket/socket";

export default function StudentDashboard({ user, setPage }) {
  const [enrollments, setEnrollments] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [liveProgress, setLiveProgress] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/student");
        setEnrollments(res.data.courses);
        setTotalCourses(res.data.totalCourses);
        
        // Initialize live progress state from DB progress
        const initialProgress = {};
        res.data.courses.forEach(enroll => {
          initialProgress[enroll.course._id] = enroll.progress;
        });
        setLiveProgress(initialProgress);

        if (res.data.courses.length > 0) {
          const lbRes = await API.get(`/dashboard/leaderboard/${res.data.courses[0].course._id}`);
          setLeaderboard(lbRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    // Listen for progress updates from socket
    const handler = (data) => {
      if(data.courseId && data.progress !== undefined) {
        setLiveProgress(prev => ({
          ...prev,
          [data.courseId]: data.progress
        }));
      }
    };
    socket.on("progressUpdated", handler);
    return () => socket.off("progressUpdated", handler);
  }, []);

  const progressVals = Object.values(liveProgress);
  const avg = progressVals.length ? Math.round(progressVals.reduce((a, b) => a + b, 0) / progressVals.length) : 0;
  const completed = progressVals.filter(p => p >= 90).length;

  return (
    <div className="page fade-up">
      <div className="mb-24">
        <h1 style={{ marginBottom: 4 }}>
          Good morning, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(" ")[0] || "Student"}</span>
        </h1>
        <div style={{ color: "var(--text-secondary)", fontSize: 16 }}>You're on a 7-day streak · Keep it up! 🚀</div>
      </div>

      <div className="dashboard-grid">
        {[
          { icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>, label: "Enrolled Courses", value: totalCourses, sub: "currently taken" },
          { icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Completed", value: completed, sub: "courses finished" },
          { icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, label: "Avg Progress", value: `${avg}%`, sub: "across all courses" },
          { icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, label: "Day Streak", value: "7", sub: "days in a row" },
        ].map((s, i) => (
          <div key={i} className="stat-card card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Enrolled Courses</div>
              <div className="section-sub">Live progress tracking <span className="live-dot" style={{ marginLeft: 8 }} /></div>
            </div>
            <button className="btn btn-secondary" onClick={() => setPage("courses")}>View All</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {enrollments.slice(0, 4).map((enroll, i) => {
              const c = enroll.course;
              const p = liveProgress[c._id] || 0;
              return (
              <div key={c._id} className="card p-24 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: 'var(--shadow-sm)' }}>
                    <img src={c.image} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{c.category}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "var(--primary)" }}>{Math.round(p)}%</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p}%` }}></div>
                </div>
              </div>
            )})}
            {enrollments.length === 0 && <div className="card p-24 text-center text-muted">You are not enrolled in any courses yet.</div>}
          </div>
        </div>

        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Leaderboard</div>
              <div className="section-sub">Top performers</div>
            </div>
          </div>

          <div className="card fade-up" style={{ animationDelay: "0.2s", overflow: 'hidden' }}>
            {leaderboard.length === 0 && <div className="p-24" style={{fontSize: 14, textAlign: 'center', color: 'var(--text-muted)'}}>No leaderboard data yet.</div>}
            {leaderboard.slice(0, 5).map((s, i) => {
              let rankClass = "rank-other";
              if(i === 0) rankClass = "rank-1";
              else if(i === 1) rankClass = "rank-2";
              else if(i === 2) rankClass = "rank-3";
              
              return (
              <div key={i} style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 16, 
                padding: "16px 24px", 
                borderBottom: i < 4 ? "1px solid var(--border)" : "none",
                background: i === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                transition: 'var(--transition)'
              }} className="hover:bg-slate-50">
                <div className={`rank-badge ${rankClass}`}>
                  {i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${s.rank}`}
                </div>
                <Avatar name={s.user.name} color={i === 0 ? "#f59e0b" : "var(--primary)"} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{s.user.name}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: i === 0 ? "#f59e0b" : "var(--primary)" }}>{s.progress}%</div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
