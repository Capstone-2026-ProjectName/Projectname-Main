// 비밀번호 찾기 이메일 입력 화면
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

function ForgotPasswordPage({ isDarkMode }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("비밀번호 재설정 메일을 발송 중입니다...");

    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      toast.success("메일이 발송되었습니다.", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "메일 발송에 실패했습니다.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className={`max-w-md w-full p-8 rounded-3xl shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h2 className={`text-2xl font-black mb-4 text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>비밀번호 찾기</h2>
        <p className={`text-sm text-center mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          가입하신 이메일 주소를 입력하시면<br/>비밀번호 재설정 링크를 보내드립니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>이메일</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={inputClass} 
              placeholder="example@email.com" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "발송 중..." : "재설정 링크 보내기"}
          </button>
        </form>

        <div className="mt-8 text-center border-t pt-6 border-slate-700/30">
          <Link to="/" className="text-sm font-bold text-blue-500 hover:underline">
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;