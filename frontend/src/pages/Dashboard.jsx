import { useEffect, useState } from "react";
import {
  Users,
  Phone,
  UserCheck,
  CalendarCheck,
  PhoneCall,
  UserPlus,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real candidates from database
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const response = await API.get("/candidates");

      if (response.data.success) {
        setCandidates(response.data.candidates || []);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Dynamic Dashboard Statistics
  // -----------------------------

  const totalCandidates = candidates.length;

  const interestedCandidates = candidates.filter(
    (candidate) =>
      candidate.status === "Shortlisted" ||
      candidate.status === "Hired"
  ).length;

  // Calls and Follow-ups backend abhi implement nahi hue hain,
  // isliye fake numbers nahi dikha rahe.
  const callsToday = 0;
  const followUps = 0;

  // Latest 5 candidates
  const recentCandidates = [...candidates]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // Logged-in user
  const storedUser = localStorage.getItem("user");

  let userName = "Admin";

  try {
    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.name) {
        userName = user.name;
      }
    }
  } catch (error) {
    console.error("Error reading user data:", error);
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status class
  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "status-new";

      case "Contacted":
        return "status-contacted";

      case "Screening":
        return "status-screening";

      case "Shortlisted":
        return "status-shortlisted";

      case "Rejected":
        return "status-rejected";

      case "Hired":
        return "status-hired";

      default:
        return "status-new";
    }
  };

  return (
    <div className="dashboard">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-heading">
        <div>
          <h1>Good evening, {userName} 👋</h1>

          <p>
            Here's what's happening with your recruitment operations today.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/candidates")}
        >
          <PhoneCall size={18} />
          Start Calling
        </button>
      </div>

      {/* =========================
          STAT CARDS
      ========================== */}

      <div className="stats-grid">

        <StatCard
          title="Total Candidates"
          value={totalCandidates}
          change=""
          icon={Users}
          iconClass="blue"
        />

        <StatCard
          title="Calls Today"
          value={callsToday}
          change="Coming soon"
          icon={Phone}
          iconClass="green"
        />

        <StatCard
          title="Interested"
          value={interestedCandidates}
          change=""
          icon={UserCheck}
          iconClass="purple"
        />

        <StatCard
          title="Follow-ups"
          value={followUps}
          change="Coming soon"
          icon={CalendarCheck}
          iconClass="orange"
        />

      </div>

      {/* =========================
          MAIN DASHBOARD GRID
      ========================== */}

      <div className="dashboard-grid">

        {/* =========================
            RECENT CANDIDATES
        ========================== */}

        <div className="recent-calls">

          <div className="section-header">

            <div>
              <h2>Recent Candidates</h2>

              <p>
                Latest candidates added to your recruitment pipeline
              </p>
            </div>

            <button
              className="view-all"
              onClick={() => navigate("/candidates")}
            >
              View All
              <ArrowUpRight size={16} />
            </button>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="empty-state">
              <p>Loading candidates...</p>
            </div>
          ) : recentCandidates.length === 0 ? (

            /* No candidates */

            <div className="empty-state">

              <UserPlus size={40} />

              <h3>No candidates yet</h3>

              <p>
                Add your first candidate to start building your recruitment
                pipeline.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/candidates")}
              >
                <UserPlus size={17} />
                Add Candidate
              </button>

            </div>

          ) : (

            

            // =================Candidate List================

            <div className="candidate-list">

              {recentCandidates.map((candidate) => (

                <div
                  className="candidate-item"
                  key={candidate._id}
                >

                  {/* Candidate Avatar */}

                  <div className="candidate-avatar">
                    {candidate.name
                      ? candidate.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "NA"}
                  </div>

                  {/* Candidate Information */}

                  <div className="candidate-info">

                    <h3>{candidate.name}</h3>

                    <p>
                      {candidate.position || "Position not specified"}
                    </p>

                    <span>
                      {candidate.email}
                    </span>

                  </div>

                  {/* Candidate Status */}

                  <div className="candidate-status">

                    <span
                      className={`status-badge ${getStatusClass(
                        candidate.status
                      )}`}
                    >
                      {candidate.status || "New"}
                    </span>

                    <small>
                      {formatDate(candidate.createdAt)}
                    </small>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <div className="quick-actions">

          <div className="section-header">

            <div>
              <h2>Quick Actions</h2>

              <p>Common recruitment tasks</p>
            </div>

          </div>

          {/* Add Candidate */}

          <button
            className="action-card"
            onClick={() => navigate("/candidates")}
          >

            <div className="action-icon blue">
              <UserPlus size={20} />
            </div>

            <div>
              <h3>Add Candidate</h3>

              <p>
                Add a new candidate to your database
              </p>
            </div>

            <ArrowUpRight size={18} />

          </button>

          {/* Make Call */}

          <button
            className="action-card"
            onClick={() =>
              alert("Calling feature will be connected next.")
            }
          >

            <div className="action-icon green">
              <PhoneCall size={20} />
            </div>

            <div>
              <h3>Make a Call</h3>

              <p>
                Start an outbound recruitment call
              </p>
            </div>

            <ArrowUpRight size={18} />

          </button>

          {/* Follow-up */}

          <button
            className="action-card"
            onClick={() =>
              alert("Follow-up management will be connected next.")
            }
          >

            <div className="action-icon orange">
              <Clock size={20} />
            </div>

            <div>
              <h3>Schedule Follow-up</h3>

              <p>
                Schedule a candidate follow-up
              </p>
            </div>

            <ArrowUpRight size={18} />

          </button>

          {/* View Candidates */}

          <button
            className="action-card"
            onClick={() => navigate("/candidates")}
          >

            <div className="action-icon purple">
              <Users size={20} />
            </div>

            <div>
              <h3>View Candidates</h3>

              <p>
                Manage your candidate pipeline
              </p>
            </div>

            <ArrowUpRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;