import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from "../config";
import toast from 'react-hot-toast';
import PageLayout from '../components/PageLayout';

const SetupProfile = ({ isDarkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    username: '',
    age: '',
    phone: '',
    useInternationalAge: false,
    profileImage: null,
    previewUrl: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        profileImage: file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({ ...profile, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('oneresume-token');
    const loading = toast.loading("프로필 정보를 저장 중입니다...");
    
    const formData = new FormData();
    formData.append('username', profile.username);
    formData.append('age', profile.age);
    formData.append('phone', profile.phone);
    formData.append('useInternationalAge', profile.useInternationalAge);
    if (profile.profileImage) {
      formData.append('profileImage', profile.profileImage);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/auth/profile-setup`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      toast.success("프로필 작성이 완료되었습니다!", { id: loading });
      navigate('/edit'); 
    } catch (err) {
      console.error('저장 실패:', err);
      toast.error(err.response?.data?.message || "프로필 저장 실패", { id: loading });
    }
  };

  return (
    <PageLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
      <div className="w-full max-w-[640px] flex flex-col gap-6 py-4">
        {/* 상단 타이틀 영역 */}
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <span className="text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">STEP 1: PROFILE DETAILS</span>
          </div>
          <h1 className="text-zinc-800 dark:text-zinc-100 text-3xl md:text-4xl font-extrabold tracking-tight">프로필을 완성해주세요</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium px-4">OneResume에서 당신의 커리어 여정을 시작하기 위한 첫 번째 단계입니다.</p>
        </div>

        {/* 메인 카드 */}
        <div className="relative bg-white dark:bg-zinc-800 rounded-[32px] md:rounded-[48px] shadow-2xl border border-zinc-100 dark:border-zinc-700 p-8 md:p-10 pt-12 flex flex-col gap-6 transition-all mx-4 md:mx-0">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-t-[32px] md:rounded-t-[48px] overflow-hidden">
            <div className="w-1/3 h-full bg-blue-700 shadow-[0px_0px_12px_rgba(45,71,226,0.4)]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 이미지 영역 */}
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="relative w-28 h-28 md:w-32 md:h-32 bg-gray-50 dark:bg-zinc-700/50 rounded-full border-2 border-zinc-200 dark:border-zinc-600 flex justify-center items-center cursor-pointer overflow-hidden group shadow-inner transition-all hover:border-blue-500"
              >
                {profile.previewUrl ? (
                  <img src={profile.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">변경하기</span>
                </div>
              </div>
              <span className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">프로필 사진 등록</span>
              <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
            </div>

            {/* 입력 폼 영역 */}
            <div className="grid gap-4 md:gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">이름 (Name)</label>
                <input
                  name="username"
                  type="text"
                  placeholder="홍길동"
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-700/50 rounded-[20px] text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold border border-transparent dark:border-zinc-600 text-base"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">나이 (Age)</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="useInternationalAge" 
                      checked={profile.useInternationalAge} 
                      onChange={handleChange} 
                      className="sr-only peer" 
                    />
                    <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${isDarkMode ? 'bg-zinc-700 border-zinc-600 peer-checked:bg-blue-600 peer-checked:border-blue-600' : 'bg-gray-100 border-zinc-300 peer-checked:bg-blue-600 peer-checked:border-blue-600'}`}>
                      <svg className={`w-3 h-3 text-white transition-transform duration-200 ${profile.useInternationalAge ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 group-hover:text-blue-500 transition-colors">만 나이</span>
                  </label>
                </div>
                <input
                  name="age"
                  type="number"
                  placeholder="28"
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-700/50 rounded-[20px] text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold border border-transparent dark:border-zinc-600 text-base"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest">휴대폰 번호 (Phone)</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-zinc-700/50 rounded-[20px] text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold border border-transparent dark:border-zinc-600 text-base"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-2">
              <button 
                type="submit"
                className="w-full py-4 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-blue-700/20 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                다음 단계로 →
              </button>
              
              <div className="text-center text-zinc-400 dark:text-zinc-500 text-[10px] uppercase leading-relaxed tracking-tight">
                By continuing, you agree to our <span className="text-zinc-600 dark:text-zinc-300 font-bold underline cursor-pointer">Terms</span> and <span className="text-zinc-600 dark:text-zinc-300 font-bold underline cursor-pointer">Privacy</span>.
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default SetupProfile;