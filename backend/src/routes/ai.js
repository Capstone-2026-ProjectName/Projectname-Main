const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// AI 첨삭 엔드포인트
router.post("/audit", aiController.auditResumeContent);

module.exports = router;
