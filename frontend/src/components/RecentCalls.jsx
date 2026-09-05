import {
  Phone,
  MoreHorizontal
} from "lucide-react";

const calls = [
  {
    name: "Rahul Sharma",
    role: "React Developer",
    time: "10:42 AM",
    duration: "04:32",
    status: "Interested"
  },
  {
    name: "Priya Singh",
    role: "Data Analyst",
    time: "10:15 AM",
    duration: "03:18",
    status: "Follow-up"
  },
  {
    name: "Aman Verma",
    role: "Node.js Developer",
    time: "09:48 AM",
    duration: "02:51",
    status: "Not Interested"
  },
  {
    name: "Neha Gupta",
    role: "Frontend Developer",
    time: "09:20 AM",
    duration: "05:12",
    status: "Interested"
  }
];

function RecentCalls() {
  return (
    <div className="recent-calls">

      <div className="section-header">

        <div>
          <h3>Recent Calls</h3>
          <p>Your latest calling activity</p>
        </div>

        <button className="view-button">
          View All
        </button>

      </div>

      <div className="calls-table">

        <div className="table-head">
          <span>Candidate</span>
          <span>Time</span>
          <span>Duration</span>
          <span>Disposition</span>
          <span></span>
        </div>

        {calls.map((call, index) => (

          <div className="table-row" key={index}>

            <div className="candidate-info">

              <div className="candidate-avatar">
                {call.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                }
              </div>

              <div>
                <strong>{call.name}</strong>
                <small>{call.role}</small>
              </div>

            </div>

            <span>{call.time}</span>

            <span className="duration">
              <Phone size={14} />
              {call.duration}
            </span>

            <span
              className={`status ${call.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {call.status}
            </span>

            <button className="more-button">
              <MoreHorizontal size={18} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentCalls;