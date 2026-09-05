const Candidate = require("../models/Candidate");

// Create candidate
const createCandidate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      skills,
      experience,
      position,
      location,
      status,
      resumeUrl,
      notes,
      source
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required"
      });
    }

    const candidate = await Candidate.create({
      companyId: req.user.companyId,
      name,
      email,
      phone,
      skills: skills || [],
      experience: experience || 0,
      position,
      location,
      status: status || "New",
      resumeUrl,
      notes,
      source: source || "Manual"
    });

    res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      candidate
    });

  } catch (error) {
    console.error("Create Candidate Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create candidate"
    });
  }
};


// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      companyId: req.user.companyId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      candidates
    });

  } catch (error) {
    console.error("Get Candidates Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch candidates"
    });
  }
};


// Get single candidate
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    res.status(200).json({
      success: true,
      candidate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch candidate"
    });
  }
};


// Update candidate
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      candidate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update candidate"
    });
  }
};


// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete candidate"
    });
  }
};


module.exports = {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate
};