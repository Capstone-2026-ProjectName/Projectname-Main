const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');

// 워크넷 직업 정보 검색
router.get('/worknet/jobs', externalController.searchJobs);

// 워크넷 학과 정보 검색
router.get('/worknet/departments', externalController.searchDepartments);

module.exports = router;
