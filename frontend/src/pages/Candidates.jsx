import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";
import API from "../services/api";
import "./Candidates.css";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    position: "",
    location: "",
    status: "New",
    notes: "",
    source: "Manual",
  });

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const response = await API.get("/candidates");

      setCandidates(response.data.candidates || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      alert("Unable to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingCandidate(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      skills: "",
      experience: "",
      position: "",
      location: "",
      status: "New",
      notes: "",
      source: "Manual",
    });

    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);

    setFormData({
      name: candidate.name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      skills: candidate.skills?.join(", ") || "",
      experience: candidate.experience || "",
      position: candidate.position || "",
      location: candidate.location || "",
      status: candidate.status || "New",
      notes: candidate.notes || "",
      source: candidate.source || "Manual",
    });

    setShowModal(true);
  };

  // Add / Update Candidate
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const candidateData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        experience: Number(formData.experience) || 0,
      };

      if (editingCandidate) {
        await API.put(
          `/candidates/${editingCandidate._id}`,
          candidateData
        );
        alert("Candidate updated successfully");
      } else {
        await API.post("/candidates", candidateData);
        alert("Candidate added successfully");
      }

      setShowModal(false);
      fetchCandidates();
    } catch (error) {
      console.error("Candidate save error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while saving candidate"
      );
    }
  };

  // Delete Candidate
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/candidates/${id}`);

      alert("Candidate deleted successfully");

      fetchCandidates();
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete candidate"
      );
    }
  };

  // Search + Filter
  const filteredCandidates = candidates.filter((candidate) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      candidate.name?.toLowerCase().includes(searchText) ||
      candidate.email?.toLowerCase().includes(searchText) ||
      candidate.position?.toLowerCase().includes(searchText) ||
      candidate.phone?.includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      candidate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="candidates-page">

      {/* Header */}
      <div className="candidates-header">
        <div>
          <h1>Candidates</h1>
          <p>Manage and track your recruitment candidates</p>
        </div>

        <button
          className="add-candidate-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="candidate-stats">

        <div className="stat-card">
          <span>Total Candidates</span>
          <strong>{candidates.length}</strong>
        </div>

        <div className="stat-card">
          <span>New</span>
          <strong>
            {candidates.filter((c) => c.status === "New").length}
          </strong>
        </div>

        <div className="stat-card">
          <span>Screening</span>
          <strong>
            {
              candidates.filter(
                (c) => c.status === "Screening"
              ).length
            }
          </strong>
        </div>

        <div className="stat-card">
          <span>Shortlisted</span>
          <strong>
            {
              candidates.filter(
                (c) => c.status === "Shortlisted"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* Search / Filter */}
      <div className="candidate-toolbar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Screening">Screening</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Hired">Hired</option>
        </select>

      </div>

      {/* Candidate Table */}
      <div className="candidate-table-container">

        {loading ? (
          <div className="empty-state">
            Loading candidates...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="empty-state">
            No candidates found
          </div>
        ) : (
          <table className="candidate-table">

            <thead>
              <tr>
                <th>Candidate</th>
                <th>Contact</th>
                <th>Position</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.map((candidate) => (

                <tr key={candidate._id}>

                  <td>
                    <div className="candidate-name">
                      <div className="candidate-avatar">
                        {candidate.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>{candidate.name}</strong>

                        <small>
                          {candidate.location || "Location not added"}
                        </small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="contact-info">
                      <span>{candidate.email}</span>
                      <small>{candidate.phone}</small>
                    </div>
                  </td>

                  <td>
                    {candidate.position || "-"}
                  </td>

                  <td>
                    {candidate.experience || 0} years
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${candidate.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {candidate.status}
                    </span>
                  </td>

                  <td>
                    {candidate.source || "Manual"}
                  </td>

                  <td>
                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEditModal(candidate)
                        }
                        title="Edit"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(candidate._id)
                        }
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))}
            </tbody>

          </table>
        )}

      </div>

      {/* Add / Edit Modal */}
      {showModal && (

        <div className="modal-overlay">

          <div className="candidate-modal">

            <div className="modal-header">

              <div>
                <h2>
                  {editingCandidate
                    ? "Edit Candidate"
                    : "Add Candidate"}
                </h2>

                <p>
                  Enter candidate information below
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Full Name *</label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@gmail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>

                  <input
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Full Stack Developer"
                  />
                </div>

                <div className="form-group">
                  <label>Skills</label>

                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                  />

                  <small>
                    Separate skills using commas
                  </small>
                </div>

                <div className="form-group">
                  <label>Experience (Years)</label>

                  <input
                    type="number"
                    min="0"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>

                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Noida"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">
                      Contacted
                    </option>
                    <option value="Screening">
                      Screening
                    </option>
                    <option value="Shortlisted">
                      Shortlisted
                    </option>
                    <option value="Rejected">
                      Rejected
                    </option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Source</label>

                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  >
                    <option value="Manual">Manual</option>
                    <option value="LinkedIn">
                      LinkedIn
                    </option>
                    <option value="Indeed">Indeed</option>
                    <option value="Referral">
                      Referral
                    </option>
                    <option value="Website">
                      Website
                    </option>
                  </select>
                </div>

              </div>

              <div className="form-group full-width">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add notes about the candidate..."
                  rows="4"
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingCandidate
                    ? "Update Candidate"
                    : "Add Candidate"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Candidates;