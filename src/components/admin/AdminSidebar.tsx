import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, Settings, LayoutDashboard, Newspaper, Image, Users, Phone, UserCheck, Database } from 'lucide-react'; // İkonlar

const AdminSidebar: React.FC = () => {
  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/user-management', icon: <UserCheck size={20} />, label: 'Kullanıcı Yönetimi' },
    { to: '/admin/data-consistency', icon: <Database size={20} />, label: 'Veri Tutarlılığı' },
    { to: '/admin/home-settings', icon: <Home size={20} />, label: 'Anasayfa Yönetimi' },
    { to: '/admin/about-settings', icon: <Info size={20} />, label: 'Hakkımızda Yönetimi' },
    { to: '/admin/education-settings', icon: <Settings size={20} />, label: 'Eğitim Yönetimi' },
    { to: '/admin/gallery-settings', icon: <Image size={20} />, label: 'Galeri Yönetimi' },
    { to: '/admin/news-settings', icon: <Newspaper size={20} />, label: 'Haberler Yönetimi' },
    { to: '/admin/teachers-settings', icon: <Users size={20} />, label: 'Öğretmenler Yönetimi' },
    { to: '/admin/contact-settings', icon: <Phone size={20} />, label: 'İletişim Yönetimi' },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground p-4 space-y-2">
      <div className="text-2xl font-bold text-primary mb-6 px-2">
        Admin Paneli
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
