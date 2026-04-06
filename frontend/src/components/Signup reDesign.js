import { API_BASE_URL } from "../config";
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Signup = ({ onSuccess, onSwitch, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 디자인의 비밀번호 확인 추가
  const [subdomain, setSubdomain] = useState('');
  const [step, setStep] = useState(0); 

  // 기존 로직 유지
  const handleSendCode = async () => {
    const loading = toast.loading("인증번호를 발송 중입니다...");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-code`, { email });
      toast.success("메일함을 확인해주세요", { id: loading });
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "발송 실패", { id: loading });
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/verify-code`, { email, code });
      toast.success("인증되었습니다! 가입 정보를 입력하세요.");
      setStep(2);
    } catch (err) {
      toast.error("인증번호가 틀렸습니다.");
    }
  };

  const handleFinalSignup = async () => {
    if (password !== confirmPassword) {
      return toast.error("비밀번호가 일치하지 않습니다.");
    }
    const loading = toast.loading("회원가입 처리 중...");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password, subdomain });
      toast.success("OneResume에 오신 걸 환영합니다", { id: loading });
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "가입 중 오류 발생", { id: loading });
    }
  };

  // 디자인 적용된 공통 인풋 스타일
  const inputContainerClass = `self-stretch relative flex flex-col justify-start items-start mb-4`;
  const inputClass = `self-stretch pl-11 pr-4 py-3.5 rounded-[48px] outline-none transition-all focus:ring-2 focus:ring-blue-500 ${
    isDarkMode 
      ? 'bg-slate-800 text-white border-slate-700 placeholder-slate-500' 
      : 'bg-gray-100 text-zinc-800 border-transparent placeholder-zinc-400'
  }`;

  return (
    <div className={`w-full max-w-[1100px] flex rounded-[32px] shadow-2xl overflow-hidden border ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      
      {/* 좌측 디자인 섹션 (Stitch 디자인 이식) */}
      <div className="hidden lg:flex w-[550px] relative bg-gray-100 overflow-hidden">
        <img className="w-full h-full absolute object-cover opacity-90" src="https://placehold.co/550x842" alt="Background" />
        <div className="w-full h-full absolute mix-blend-multiply bg-blue-700/20"></div>
        <div className="w-full h-full p-12 relative flex flex-col justify-between items-start text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
              <div className="w-5 h-4 bg-blue-700"></div>
            </div>
            <div className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">OneResume</div>
          </div>
          <div className="max-w-xs space-y-4">
            <h2 className="text-4xl font-bold font-['Plus_Jakarta_Sans'] leading-tight">Curate your<br/>professional<br/>destiny.</h2>
            <p className="text-white/80 text-lg font-['Manrope']">Join a system built for high-performance career intelligence.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border-2 border-blue-700" src="https://placehold.co/32x32" alt="user" />
              <div className="w-8 h-8 bg-indigo-400 rounded-full border-2 border-blue-700 flex justify-center items-center text-[10px] font-bold text-blue-950">+2k</div>
            </div>
            <span className="text-sm font-medium font-['Manrope']">Trusted by 2,000+ experts</span>
          </div>
        </div>
      </div>

      {/* 우측 폼 섹션 (기존 로직 + 새로운 UI) */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-2">
            <h2 className={`text-3xl font-extrabold font-['Plus_Jakarta_Sans'] ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Create Account</h2>
            <p className={`text-base font-['Manrope'] ${isDarkMode ? 'text-slate-400' : 'text-zinc-600'}`}>Secure your professional intelligence profile.</p>
          </div>

          <div className="space-y-6">
            {/* Step 0 & 1: 이메일 및 인증 코드 입력 */}
            {step < 2 && (
              <>
                <div className={inputContainerClass}>
                  <label className={`block text-sm font-semibold mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-zinc-600'}`}>Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    disabled={step > 0}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. j.doe@oneresume.com"
                  />
                </div>

                {step === 1 && (
                  <div className={`${inputContainerClass} animate-fade-in`}>
                    <label className={`block text-sm font-semibold mb-2 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-zinc-600'}`}>Verification Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={inputClass}
                        placeholder="000000"
                      />
                      <button onClick={handleVerifyCode} className="px-6 py-3 bg-blue-600 text-white rounded-[48px] font-bold hover:bg-blue-700">확인</button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={step === 0 ? handleSendCode : null}
                  className={`w-full py-4 bg-blue-700 text-white rounded-[48px] font-bold shadow-lg transition-all active:scale-95 ${step === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                >
                  {step === 0 ? "Send Verification Code" : "Verify to Continue"}
                </button>
              </>
            )}

            {/* Step 2: 비밀번호 및 서브도메인 설정 */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className={inputContainerClass}>
                  <label className="block text-sm font-semibold mb-2 ml-1 text-zinc-600">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>
                <div className={inputContainerClass}>
                  <label className="block text-sm font-semibold mb-2 ml-1 text-zinc-600">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>
                <div className={inputContainerClass}>
                  <label className="block text-sm font-semibold mb-2 ml-1 text-zinc-600">Personal Subdomain</label>
                  <div className="flex items-center">
                    <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className={`${inputClass} !rounded-r-none border-r-0`} placeholder="my-domain" />
                    <span className={`px-4 py-3.5 rounded-r-[48px] font-bold text-sm border-l ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-zinc-500'}`}>.oneresume.com</span>
                  </div>
                </div>
                <button onClick={handleFinalSignup} className="w-full py-4 bg-blue-700 text-white rounded-[48px] font-black text-lg hover:bg-blue-800 shadow-xl transition-all active:scale-95">
                  Create Professional Profile
                </button>
              </div>
            )}
          </div>

          <div className="text-center pt-6 border-t border-zinc-100 flex justify-center gap-1">
            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-zinc-600'}`}>Already have an account?</span>
            <button onClick={onSwitch} className="text-sm font-bold text-blue-700 hover:underline">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;