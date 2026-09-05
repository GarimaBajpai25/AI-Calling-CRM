const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    skills: {
      type: [String],
      default: []
    },

    experience: {
      type: Number,
      default: 0
    },

    position: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Screening",
        "Shortlisted",
        "Rejected",
        "Hired"
      ],
      default: "New"
    },

    resumeUrl: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    },

    source: {
      type: String,
      default: "Manual"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Candidate",
  candidateSchema
);