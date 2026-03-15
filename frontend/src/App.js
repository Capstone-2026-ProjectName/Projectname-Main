import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '', email: '', education: '', skills: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/save-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => console.error("에러:", err));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">OneResume</h1>
        <p className="text-slate-500">나만의 전문적인 이력서를 1분 만에 완성하세요</p>
      </header>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* 입력 카드 영역 */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 text-slate-800">정보 입력</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">이름</label>
              <input type="text" name="name" onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">이메일</label>
              <input type="email" name="email" onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">최종 학력</label>
              <input type="text" name="education" onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="OO대학교 컴퓨터공학과" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">보유 기술 (쉼표 구분)</label>
              <input type="text" name="skills" onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="React, Tailwind, Node.js" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95">
              이력서 저장하기
            </button>
          </form>
        </div>

        {/* 미리보기 영역 (A4 종이 느낌) */}
        <div className="flex-1 bg-white p-10 rounded-sm shadow-xl border-t-[12px] border-blue-600 min-h-[600px]">
          <div className="border-b-2 border-slate-100 pb-8 mb-8">
            <h2 className="text-4xl font-black text-slate-900 mb-2">{formData.name || '이름'}</h2>
            <p className="text-blue-600 font-bold">{formData.email || '이메일 주소'}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-black mb-3">Education</h3>
              <p className="text-lg font-medium text-slate-800">{formData.education || '학력 사항을 입력해 주세요.'}</p>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-widest text-slate-400 font-black mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills ? formData.skills.split(',').map((s, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
                    {s.trim()}
                  </span>
                )) : <p className="text-slate-300">기술 스택이 여기에 표시됩니다.</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;