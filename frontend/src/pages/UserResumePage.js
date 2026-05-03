// 남들이 내 서브도메인으로 들어왔을 때 보여줄 결과 화면
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import ResumePreview from "../components/ResumePreview";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

function UserResumePage({ subdomain }) {
  const resumeRef = useRef();
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const [focusedPage, setFocusedPage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const mapUserDataToFields = useCallback((user) => {
    const resume = user.resumes?.[0] || {};
    const eduParts = resume.education ? resume.education.split(" | ") : [];
    
    return {
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      addressDetail: user.addressDetail || "",
      age: user.age || "",
      gender: user.gender || "",
      useInternationalAge: user.useInternationalAge || false,
      militaryStatus: user.militaryStatus || "",
      militaryBranch: user.militaryBranch || "",
      militaryRank: user.militaryRank || "",
      militaryStartDate: user.militaryStartDate || "",
      militaryEndDate: user.militaryEndDate || "",
      militaryExemption: user.militaryExemption || "",
      subdomain: user.subdomain || "",
      bio: user.bio || "",
      profileImageUrl: user.profileImageUrl || "",
      githubUrl: user.githubUrl || "",
      blogUrl: user.blogUrl || "",
      resumeTitle: resume.title || "개발자 이력서",
      school: eduParts[0] || "",
      major: eduParts[1] || "",
      gpa: eduParts[2] || "",
      skills: resume.skills || "",
      workExperiences: resume.workExperiences || [],
      certifications: resume.certifications || [],
      projects: resume.projects?.length > 0
        ? resume.projects.map((p, i) => ({ ...p, id: `db-${p.id || i}` }))
        : [],
      selfIntroGrowth: resume.selfIntroGrowth || "",
      selfIntroCharacter: resume.selfIntroCharacter || "",
      selfIntroMotivation: resume.selfIntroMotivation || "",
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/resume/user/${subdomain}`);
        if (response.data) {
          setFormData(mapUserDataToFields(response.data));
        }
      } catch (err) {
        console.error("데이터 로드 에러:", err);
        toast.error("이력서를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    const savedTheme = localStorage.getItem("oneresume-theme");
    if (savedTheme) setIsDarkMode(savedTheme === "true");
  }, [subdomain, mapUserDataToFields]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("oneresume-theme", newTheme.toString());
  };

  const downloadPDF = () => {
    toast.success("PDF 출력을 시작합니다");
    setTimeout(() => window.print(), 1000);
  };

  const handlePrevPage = (e) => {
    e.stopPropagation();
    setFocusedPage(prev => (prev === 1 ? totalPages : prev - 1));
  };

  const handleNextPage = (e) => {
    e.stopPropagation();
    setFocusedPage(prev => (prev === totalPages ? 1 : prev + 1));
  };

  const getScale = () => {
    const a4HeightPx = 1122.52;
    if (focusedPage) return (windowSize.height - 120) / a4HeightPx;
    // PC 기준 기본 스케일을 더 크게(0.6) 조정하여 선명도 확보
    if (windowSize.width < 640) return 0.35;
    if (windowSize.width < 1024) return 0.5;
    return 0.6;
  };

  const baseScale = getScale();

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-lg animate-pulse">이력서를 불러오는 중...</p>
      </div>
    </div>
  );

  if (!formData) return <div className="text-center py-20 text-xl font-bold">존재하지 않는 페이지입니다.</div>;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#09090b]' : 'bg-[#f4f4f5]'}`}>
      <header className={`fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-[200] backdrop-blur-xl border-b print:hidden transition-all duration-300 shadow-sm ${
        isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white/40 border-black/5'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black text-xl">O</div>
          <div>
            <h1 className={`text-lg font-black tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>OneResume</h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Professional Portfolio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border ${
              isDarkMode ? "bg-zinc-800 border-zinc-700 text-yellow-400" : "bg-white border-zinc-200 text-zinc-600"
            }`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 text-sm">
            <span>PDF 저장</span>
          </button>
        </div>
      </header>

      <main className={`pt-32 pb-20 px-4 flex flex-col items-center justify-start min-h-screen relative z-10 ${focusedPage ? 'overflow-hidden' : ''}`}>
        <div className="text-center mb-16 animate-fade-in print:hidden">
          <h2 className={`text-4xl sm:text-5xl font-black mb-4 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {formData.username}
          </h2>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {formData.bio || "반갑습니다! 제 이력서를 소개합니다."}
          </p>
        </div>

        {focusedPage && (
          <div className="fixed inset-0 z-[150] pointer-events-none flex flex-col items-center justify-between p-6 animate-fade-in print:hidden">
            <div className="w-full flex justify-end pointer-events-auto">
              <button onClick={() => setFocusedPage(null)} className="w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-2xl text-white rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-90 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="w-full flex justify-between items-center px-2">
              <button onClick={handlePrevPage} className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-90 border border-white/10 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={handleNextPage} className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-90 border border-white/10 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="pointer-events-auto flex items-center gap-4 bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-[32px] border border-white/10 shadow-2xl mb-4">
              <button onClick={() => setFocusedPage(null)} className="flex items-center gap-2 text-white font-black text-xs pr-6 border-r border-white/20 hover:text-blue-400 transition-colors uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Grid View
              </button>
              <span className="text-white/80 font-black text-xs italic tracking-widest pl-2">
                PAGE {String(focusedPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        <div className={`w-full flex justify-center items-start transition-all duration-700 ${focusedPage ? 'z-[140]' : ''}`}>
          <div 
            className="transform-gpu flex items-center justify-center shrink-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)]" 
            style={{ 
              transform: `scale(${baseScale})`, 
              transformOrigin: 'top center',
              marginTop: focusedPage ? '0px' : '20px',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            {/* paneWidth를 50으로 설정하여 PC에서 기본 2열로 보이게 함 (더 선명함) */}
            <ResumePreview 
              formData={formData} 
              ref={resumeRef} 
              isDarkMode={isDarkMode} 
              paneWidth={50} 
              focusedPage={focusedPage} 
              setFocusedPage={setFocusedPage} 
              setTotalPages={setTotalPages} 
              containerHeight={windowSize.height - 120} 
              scale={baseScale} 
              marginTop={0} 
            />
          </div>
        </div>

        {!focusedPage && (
          <div className={`mt-20 text-center animate-bounce opacity-40 print:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <p className="text-sm font-bold tracking-widest uppercase">Click a page to zoom</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </div>
        )}
      </main>

      <div className="hidden print:block bg-white relative">
        <ResumePreview formData={formData} isDarkMode={false} printMode={true} />
      </div>

      <footer className="py-12 text-center opacity-30 font-bold tracking-tighter text-sm print:hidden">
        <p>&copy; 2026 OneResume. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserResumePage;