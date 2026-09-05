const express = require("express");

const {
    createCandidate,
    getCandidates,
    getCandidate,
    updateCandidate,
    deleteCandidate
} = require("../controllers/candidateController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create candidate
router.post(
    "/",
    authMiddleware,
    createCandidate
);

// Get all candidates
router.get(
    "/",
    authMiddleware,
    getCandidates
);

// Get single candidate
router.get(
    "/:id",
    authMiddleware,
    getCandidate
);

// Update candidate
router.put(
    "/:id",
    authMiddleware,
    updateCandidate
);

// Delete candidate
router.delete(
    "/:id",
    authMiddleware,
    deleteCandidate
);

module.exports = router;