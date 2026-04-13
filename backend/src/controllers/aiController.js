const axios = require("axios");

exports.auditResumeContent = async (req, res) => {
  try {
    const { fieldName, content, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "서버에 API 키가 설정되지 않았습니다." });
    }

    if (!content || content.trim().length < 5) {
      return res.status(400).json({ 
        message: "분석할 내용이 너무 짧습니다. 최소 5자 이상 입력해 주세요." 
      });
    }

    // [최종 해결] 2.0/2.5는 아직 쿼터가 0일 수 있으므로, 리스트에 있는 안정적인 별칭(Alias) 사용
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `
      당신은 세계 최고의 커리어 코치이자 이력서 첨삭 전문가입니다. 
      사용자가 작성한 이력서의 특정 항목을 분석하여 실시간으로 피드백을 주세요.

      [분석 대상 항목]: ${fieldName}
      [현재 작성된 내용]: "${content}"
      [추가 컨텍스트]: ${context || "없음"}

      [첨삭 가이드라인]:
      1. [한 줄 소개(Bio)] 항목인 경우, 반드시 50자 이내의 강렬한 '한 줄' 문장으로 제안하세요. (에세이 금지)
      2. 사용자가 입력하지 않은 정보(예: [00]%, [성과])를 대괄호나 빈칸 형식으로 억지로 넣지 마세요. 
      3. 구체적인 수치가 없다면 전문적인 어휘(예: '최적화', '효율화', '기여')를 사용하여 문장의 품격을 높이세요.
      4. STAR 기법을 활용하되, 결과(Result)를 문장의 앞부분에 배치하여 임팩트를 주는 방식도 고려하세요.
      5. 답변은 정중하면서도 자신감을 주는 전문가의 톤앤매너를 유지하세요.

      [답변 형식 (반드시 JSON으로만 답변하세요)]:
      {
        "feedback": "전체적인 피드백 요약",
        "suggestions": ["구체적인 문장 수정 제안 1", "수정 제안 2"],
        "questions": ["보완을 위한 핵심 질문 1", "질문 2"],
        "refinedText": "가장 추천하는 완성형 문장 예시"
      }
    `;

    const response = await axios.post(apiUrl, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    // 응답 데이터에서 텍스트 추출
    const responseText = response.data.candidates[0].content.parts[0].text;
    
    // JSON 데이터만 추출
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI의 응답에서 유효한 데이터를 찾을 수 없습니다.");
    }

    const auditResult = JSON.parse(jsonMatch[0]);
    res.json(auditResult);

  } catch (error) {
    console.error("Gemini API Direct Error:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "AI 분석 중 오류가 발생했습니다.",
      error: error.response?.data?.error?.message || error.message 
    });
  }
};
