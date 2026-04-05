// 새 비밀번호 설정 화면
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

function ResetPasswordPage({ isDarkMode }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("비밀번호가 일치하지 않습니다.");
    }

    const toastId = toast.loading("비밀번호를 변경 중입니다...");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { token, newPassword: password });
      toast.success("비밀번호가 성공적으로 변경되었습니다!", { id: toastId });
      navigate('/'); // 로그인 화면으로 이동
    } catch (err) {
      toast.error(err.response?.data?.message || "비밀번호 변경에 실패했습니다.", { id: toastId });
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className={`max-w-md w-full p-8 rounded-3xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h2 className={`text-2xl font-black mb-6 text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>새 비밀번호 설정</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>새 비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={inputClass} 
              placeholder="8자 이상 입력" 
              required 
            />
          </div>
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>비밀번호 확인</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className={inputClass} 
              placeholder="비밀번호 다시 입력" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-600 shadow-lg transition-all active:scale-95"
          >
            비밀번호 변경 완료
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;