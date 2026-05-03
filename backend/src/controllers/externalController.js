const axios = require('axios');

/**
 * 워크넷(고용24) API 연동 컨트롤러
 */
const searchJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: '검색어가 필요합니다.' });
    }

    const authKey = process.env.WORKNET_JOB_KEY || process.env.WORKNET_OCCU_KEY;
    
    if (!authKey) {
      return res.status(500).json({ error: 'API 인증키가 설정되지 않았습니다.' });
    }

    // 워크넷 직업정보 API 호출
    const response = await axios.get('http://openapi.work.go.kr/opi/opi/opia/jobSrch.do', {
      params: {
        authKey: authKey,
        returnType: 'json',
        srchType: 'keyword',
        keyword: keyword,
        display: 10
      }
    });

    // 워크넷 API는 결과가 없을 때나 에러일 때도 200을 줄 수 있으므로 응답 구조 확인 필요
    // 보통 response.data.jobSrch에 리스트가 들어옴
    const jobs = response.data?.jobSrch || [];

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Worknet API Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: '워크넷 API 호출 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
};

/**
 * 학과 정보 검색 API
 */
const searchDepartments = async (req, res) => {
    try {
      const { keyword } = req.query;
  
      if (!keyword) {
        return res.status(400).json({ error: '검색어가 필요합니다.' });
      }
  
      const authKey = process.env.WORKNET_DEPT_KEY;
      
      if (!authKey) {
        return res.status(500).json({ error: 'API 인증키가 설정되지 않았습니다.' });
      }
  
      const response = await axios.get('http://openapi.work.go.kr/opi/opi/opia/univSrch.do', {
        params: {
          authKey: authKey,
          returnType: 'json',
          srchType: 'univNm', // 학교명 또는 학과명 검색 (API 사양에 따라 조정 필요)
          keyword: keyword,
          display: 10
        }
      });
  
      const items = response.data?.univSrch || [];
  
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      console.error('Worknet Dept API Error:', error.message);
      res.status(500).json({ 
        success: false, 
        error: '학과 정보 API 호출 중 오류가 발생했습니다.' 
      });
    }
  };

module.exports = {
  searchJobs,
  searchDepartments
};
