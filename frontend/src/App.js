import React, { useState, useRef } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    education: "",
    skills: "",
    summary: "",
    experience: "",
  });

  const resumeRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const downloadPDF = () => {
			window.print();
		};

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/save-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => console.error("에러:", err));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <header className="text-center mb-12 relative">
        <h1 className="text-4xl font-black text-slate-800 mb-2">OneResume</h1>
        <p className="text-slate-500 font-medium text-lg">
          통합 이력서 관리를 위한 정밀 데이터 구축
        </p>
        <button
          onClick={downloadPDF}
          className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto"
        >
          <span>PDF로 내보내기</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-10">
        {/* 왼쪽: 입력 카드 */}
        <div className="w-full lg:w-[450px] bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-bold mb-6 text-slate-800 border-l-4 border-blue-600 pl-3">
            정보 입력
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="abc@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                최종 학력
              </label>
              <input
                type="text"
                name="education"
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="한남대학교 컴퓨터공학과"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                보유 기술
              </label>
              <input
                type="text"
                name="skills"
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, AWS"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                한 줄 자기소개
              </label>
              <textarea
                name="summary"
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="자기소개"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                주요 프로젝트
              </label>
              <textarea
                name="experience"
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="경험 상세 내용"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
            >
              이력서 중앙 저장소로 전송
            </button>
          </form>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div
          ref={resumeRef}
          className="bg-white shadow-2xl border-t-[12px] border-blue-600 w-[210mm] min-h-[297mm] p-[20mm] text-left flex flex-col box-border overflow-hidden"
          style={{ wordBreak: "break-all" }}
        >
          {/* 헤더 */}
          <div className="border-b-2 border-slate-100 pb-8 mb-10 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              {formData.name || "이름 없음"}
            </h2>
            <div className="flex justify-center items-center gap-3 text-slate-500 text-sm font-medium">
              <span>{formData.email || "Email"}</span>
              <span className="text-slate-300">|</span>
              <span>{formData.education || "Education"}</span>
            </div>
          </div>

          {/* 본문 내용들 (모두 resumeRef 안에 포함됨) */}
          <div className="space-y-10">
            {formData.summary && (
              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-blue-600 font-black mb-3 border-l-4 border-blue-600 pl-3">
                  About Me
                </h3>
                <p className="text-lg text-slate-700 italic font-medium bg-slate-50 p-4 rounded-lg">
                  "{formData.summary}"
                </p>
              </section>
            )}

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-blue-600 font-black mb-4 border-l-4 border-blue-600 pl-3">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills ? (
                  formData.skills.split(",").map((s, i) => (
                    <span
                      key={i}
                      className="bg-white text-blue-700 px-3 py-1.5 rounded-md text-xs font-bold border border-blue-200 shadow-sm"
                    >
                      {s.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-300 text-sm">
                    기술 스택이 표시됩니다.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-blue-600 font-black mb-4 border-l-4 border-blue-600 pl-3">
                Experience & Projects
              </h3>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                {formData.experience || "경력 및 프로젝트 내용을 채워주세요."}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
