import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Thêm event listener để đóng menu khi click ra ngoài
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user, navigate]);

  const handleLogout = () => {
    // Chỉ xóa token ở client
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="w-full bg-blue-600">
      <header className="max-w-7xl mx-auto flex justify-between items-center p-4 text-white">
        <h1 className="text-xl font-bold">Hệ thống quản lý ca trực</h1>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <span>{user.fullname} ({user.role})</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-700">
              <button
                onClick={() => {
                  navigate('/me');
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
