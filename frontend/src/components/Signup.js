import { API_BASE_URL } from "../config";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PWD_REGEX, ValidationItem } from '../components/PasswordValidation';

		const Signup = ({ onSuccess, onSwitch, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
		const [confirmPassword, setConfirmPassword] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [step, setStep] = useState(0); 

		// 실시간 유효성 검사 상태
		const [validations, setValidations] = useState({
			length: false,
			upper: false,
			number: false,
			special: false,
			match: false
		});

		//비밀번호가 바뀔 때마다 체크
		useEffect(() => {
			setValidations({
				length: password.length >= 8,
				upper: /[A-Z]/.test(password),
				number: /\d/.test(password),
				special: /[@$!%*?&]/.test(password),
				match: password.length > 0 && password === confirmPassword
			});
		}, [password, confirmPassword]);

		// 입력창 테두리 및 배경색 제어 함수
const getInputBorderClass = (value, isValidSection) => {
    const baseClass = "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all duration-200 focus:ring-2 ";
    const bgClass = isDarkMode ? "bg-slate-900 text-white placeholder-slate-500 " : "bg-white text-slate-800 placeholder-slate-400 ";
    
    if (value.length > 0) {
      return baseClass + bgClass + (
        isValidSection 
          ? // 성공
            "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20" 
          : // 실패
            "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      );
    }
    // 초기 상태
    return baseClass + bgClass + (isDarkMode ? "border-slate-700" : "border-slate-200");
  };

  const handleSendCode = async () => {
    const loading = toast.loading("인증번호를 발송 중입니다...");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-code`, { email });
      toast.success("메일함을 확인해주세요", { id: loading });
      
      // [UX 개선] 이메일 입력 시 서브도메인 자동 추천 (아이디 부분만 추출)
      if (!subdomain && email.includes('@')) {
        const suggested = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        setSubdomain(suggested);
      }
      
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

  // 실시간 서브도메인 유효성 검사 로직
  const getSubdomainError = (val) => {
    if (!val) return null;
    if (!/^[a-z0-9]+$/.test(val)) return "영문 소문자와 숫자만 사용 가능합니다.";
    const forbidden = ['admin', 'api', 'www', 'mail', 'master', 'root', 'help', 'login', 'dev', 'test', 'support'];
    if (forbidden.includes(val.toLowerCase())) return "사용할 수 없는 도메인입니다.";
    if (val.length < 3) return "3자 이상 입력해주세요.";
    return null;
  };

  const handleFinalSignup = async () => {
    const subError = getSubdomainError(subdomain);
    if (subError) {
      toast.error(subError);
      return;
    }
    // 가입 전 최종 보안 체크
			if (!PWD_REGEX.test(password)) {
				toast.error("비밀번호 보안 정책을 확인해주세요.");
				return;
			}
    const loading = toast.loading("회원가입 중...");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password, subdomain });
      toast.success("OneResume에 오신 걸 환영합니다", { id: loading });
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "가입 실패", { id: loading });
    }
  };

  const inputClass = `w-full px-5 py-4 rounded-2xl border outline-none transition-all focus:ring-2 focus:ring-blue-500 text-lg ${
    isDarkMode 
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
      : 'bg-white border-slate-200 text-slate-800'
  }`;

  return (
    <div className={`max-w-[480px] w-full p-10 rounded-[40px] shadow-2xl transition-all duration-300 border ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      <h2 className={`text-3xl font-black mb-10 text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>OneResume 가입</h2>

      <div className="space-y-6">
        <div>
          <label className={`block text-base font-bold mb-2.5 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>이메일</label>
          <input 
            type="email" 
            value={email}
            disabled={step > 0}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="example@gmail.com"
          />
        </div>

        {step === 0 && (
          <button onClick={handleSendCode} className="w-full bg-blue-600 text-white py-4.5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95">
            인증번호 받기
          </button>
        )}

        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <label className={`block text-base font-bold mb-1.5 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>인증번호 6자리</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputClass}
                placeholder="000000"
              />
              <button onClick={handleVerifyCode} className={`px-8 py-4 rounded-2xl font-bold text-base transition-all whitespace-nowrap ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-800 text-white hover:bg-black'}`}>
                확인
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className={`block text-base font-bold mb-2.5 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>비밀번호</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={getInputBorderClass(password, validations.length && validations.upper && validations.number && validations.special).replace('px-4 py-3', 'px-5 py-4').replace('text-slate-800', 'text-lg text-slate-800').replace('rounded-xl', 'rounded-2xl')}
                placeholder="••••••••"
              />
														{ /* 비밀번호 인디케이터 UI */ }
														<div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mt-4 px-1">
															<ValidationItem 
                                isValid={validations.length} 
                                text={password.length > 0 && !validations.length ? "8자 미만" : "8자 이상"} 
                                isDirty={password.length > 0} 
                              />
															<ValidationItem 
                                isValid={validations.upper} 
                                text={password.length > 0 && !validations.upper ? "대문자 미포함" : "대문자 포함"} 
                                isDirty={password.length > 0} 
                              />
															<ValidationItem 
                                isValid={validations.number} 
                                text={password.length > 0 && !validations.number ? "숫자 미포함" : "숫자 포함"} 
                                isDirty={password.length > 0} 
                              /> 
															<ValidationItem 
                                isValid={validations.special} 
                                text={password.length > 0 && !validations.special ? "특수문자 미포함" : "특수문자 포함"} 
                                isDirty={password.length > 0} 
                              /> 
            </div>
										</div>
            <div>
													<label className={`block text-base font-bold mb-2.5 ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>비밀번호 확인</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
																			className={getInputBorderClass(confirmPassword, validations.match).replace('px-4 py-3', 'px-5 py-4').replace('text-slate-800', 'text-lg text-slate-800').replace('rounded-xl', 'rounded-2xl')}
                  placeholder="••••••••"
                />
																<div className="mt-2.5 mt-1">
																	<ValidationItem 
                                    isValid={validations.match} 
                                    text={confirmPassword.length > 0 && !validations.match ? "비밀번호 불일치" : "비밀번호 일치"} 
                                    isDirty={confirmPassword.length > 0} 
                                  />
																	</div>
															</div>
													<div>
														<div className="flex items-center gap-2 mb-2.5 ml-1">
                              <label className={`text-base font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>개인 도메인</label>
                              
                              {/* 툴팁 아이콘 */}
                              <div className="group relative flex items-center">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[11px] font-serif font-bold italic cursor-help transition-colors ${
                                  isDarkMode ? 'border-slate-600 text-slate-500 group-hover:text-blue-400 group-hover:border-blue-400' : 'border-slate-300 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-500'
                                }`}>
                                  i
                                </div>
                                
                                {/* 실제 툴팁 박스 */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl pointer-events-none">
                                  <p className="leading-relaxed text-center font-medium">
                                    나만의 고유한 웹 주소입니다. <br/>
                                    가입 후 이 주소를 통해 누구나 내 이력서를 볼 수 있습니다.
                                  </p>
                                  {/* 화살표 */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                                </div>
                              </div>
                            </div>

														<div className="flex items-center">
															<input
															type="text"
															value={subdomain}
															onChange={(e) => setSubdomain(e.target.value)}
															className={`flex-1 p-4 rounded-l-2xl border border-r-0 focus:outline-none focus:ring-2 transition-all text-lg ${
                                isDarkMode 
                                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                                  : 'bg-white border-slate-200 text-slate-800'
                              }`}
															placeholder="my-domain"
															/>
															<span className={`p-4 rounded-r-2xl font-bold text-lg border border-l-0 ${isDarkMode ? 'bg-slate-700 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
																.oneresume.com
                </span>
              </div>
              {/* 실시간 유효성 피드백 및 주소 미리보기 */}
              <div className="mt-3 ml-1 min-h-[24px]">
                {getSubdomainError(subdomain) ? (
                  <p className="text-xs font-bold text-red-400 uppercase tracking-tighter animate-pulse">
                    ⚠️ {getSubdomainError(subdomain)}
                  </p>
                ) : subdomain ? (
                  <p className="text-xs font-bold text-blue-500 dark:text-blue-400 tracking-tighter">
                    ✨ 내 주소: <span className="underline font-semibold">{subdomain.toLowerCase()}.oneresume.com</span>
                  </p>
                ) : (
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    나만의 고유한 이력서 주소를 설정하세요.
                  </p>
                )}
              </div>
            </div>
            <button 
												onClick={handleFinalSignup}
												disabled={!Object.values(validations).every(v => v)} // 보안 미충족 시 비활성화
												className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 ${
												Object.values(validations).every(v => v)
												? 'bg-emerald-500 text-white hover:bg-emerald-600'
												: 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'
												}`}
												>
              가입하고 시작하기
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 text-center border-t pt-8 border-slate-700/30">
        <button onClick={onSwitch} className={`text-base font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          이미 계정이 있으신가요? <span className="text-blue-500 hover:underline font-bold ml-1">로그인</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;