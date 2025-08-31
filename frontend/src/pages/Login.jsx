import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useRateLimit } from '../hooks/useRateLimit.js';
import { 
  LOGIN_TYPES, 
  ROLE_ROUTES, 
  RATE_LIMIT_CONFIG, 
  ERROR_MESSAGES 
} from '../constants/auth.js';
import { validateLoginForm } from '../utils/validation.js';

// Custom hook để xử lý lỗi đăng nhập
const useLoginError = () => {
  const [error, setError] = useState('');

  const handleError = useCallback((err) => {
    let errorMessage = ERROR_MESSAGES.LOGIN_FAILED;
    
    if (err.response) {
      switch (err.response.status) {
        case 401:
          errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
          break;
        case 403:
          errorMessage = ERROR_MESSAGES.ACCOUNT_LOCKED;
          break;
        case 404:
          errorMessage = ERROR_MESSAGES.ACCOUNT_NOT_FOUND;
          break;
        case 500:
          errorMessage = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          errorMessage = err.response.data?.message || ERROR_MESSAGES.LOGIN_FAILED;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { error, handleError, clearError };
};

// Component hiển thị lỗi
const ErrorDisplay = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-white animate-fade-in">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );
};

// Component input field
const InputField = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon, 
  autoComplete,
  onKeyPress 
}) => (
  <div className="relative">
    <input
      type={type}
      required
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="w-full px-4 py-3 pl-11 rounded-lg bg-black/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
      {icon}
    </div>
  </div>
);

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('ad');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { error, handleError, clearError } = useLoginError();
  const { checkRateLimit, resetRateLimit, isBlocked, remainingAttempts } = useRateLimit(
    RATE_LIMIT_CONFIG.maxAttempts, 
    RATE_LIMIT_CONFIG.timeWindow
  );



  // Xử lý đăng nhập
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    
    // Validation form
    const validation = validateLoginForm(username, password);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors).find(error => error);
      if (firstError) {
        handleError({ message: firstError });
      }
      return;
    }
    
    // Kiểm tra rate limit
    if (!checkRateLimit()) {
      return;
    }
    
    setLoading(true);
    clearError();

    try {
      const data = await authService.login(username, password, loginType);
      
      // Reset rate limit khi đăng nhập thành công
      resetRateLimit();
      
      // Đảm bảo role được lưu dạng lowercase
      const userData = {
        ...data.user,
        role: data.user.role.toLowerCase()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setCurrentUser(userData);

      // Navigate theo role
      const route = ROLE_ROUTES[userData.role];
      if (route) {
        navigate(route);
      } else {
        handleError({ message: ERROR_MESSAGES.NO_ACCESS });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [username, password, loginType, navigate, setCurrentUser, clearError, handleError, checkRateLimit, resetRateLimit]);

  // Xử lý thay đổi loại đăng nhập
  const handleLoginTypeChange = useCallback((type) => {
    setLoginType(type);
    clearError();
    setUsername('');
    setPassword('');
  }, [clearError]);

  // Xử lý thay đổi input
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    clearError();
  }, [clearError]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    clearError();
  }, [clearError]);

  // Xử lý key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  }, [handleLogin]);

  // Memoize icons
  const userIcon = useMemo(() => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A4.5 4.5 0 0112 15.5a4.5 4.5 0 016.879 2.304M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ), []);

  const lockIcon = useMemo(() => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-3.314 0-6 2.686-6 6h12c0-3.314-2.686-6-6-6z" />
    </svg>
  ), []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/vietinbank-building.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Top white blur strip */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/5 backdrop-blur-sm flex items-center px-4">        
      </div>
      
      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 ml-auto mr-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">DCE Portal</h1>
          <p className="text-white/70 text-sm mt-2">Đăng nhập hệ thống quản lý</p>
        </div>

        {/* Chọn loại đăng nhập */}
        <div className="flex mb-6 bg-black/20 rounded-lg overflow-hidden">
          {LOGIN_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleLoginTypeChange(type.value)}
              className={`w-1/2 py-3 font-medium transition ${
                loginType === type.value
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'text-white/60 hover:text-white hover:bg-blue-500/20'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Error Display */}
        <ErrorDisplay error={error} />

        {/* Rate Limit Warning */}
        {isBlocked && (
          <div className="mb-6 p-4 rounded-lg bg-orange-500/20 border border-orange-500/30 text-white">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{ERROR_MESSAGES.ACCOUNT_TEMPORARILY_LOCKED}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm mb-1 block">
              {loginType === 'ad' ? 'Tài khoản AD' : 'Tên đăng nhập'}
            </label>
            <InputField
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder={loginType === 'ad' ? 'Tài khoản AD' : 'Tên đăng nhập'}
              icon={userIcon}
              autoComplete="username"
              onKeyPress={handleKeyPress}
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">Mật khẩu</label>
            <InputField
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Nhập mật khẩu"
              icon={lockIcon}
              autoComplete="current-password"
              onKeyPress={handleKeyPress}
            />
          </div>

          <button
            type="submit"
            disabled={loading || isBlocked}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading || isBlocked
                ? 'bg-blue-600/40 cursor-not-allowed'
                : 'bg-blue-600/80 hover:bg-blue-600/80'
            }`}
          >
            {loading ? 'Đang xử lý...' : isBlocked ? 'Tạm khóa' : 'Đăng nhập'}
          </button>
          
          {/* Hiển thị số lần thử còn lại */}
          {remainingAttempts < RATE_LIMIT_CONFIG.maxAttempts && !isBlocked && (
            <div className="text-center text-sm text-white/60">
              Còn {remainingAttempts} lần thử đăng nhập
            </div>
          )}
        </form>

        <div className="text-center text-sm text-white/60 mt-6">
          © {new Date().getFullYear()} - DataCenter
        </div>
      </div>

      {/* Bottom white blur strip */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 backdrop-blur-sm"></div>

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
