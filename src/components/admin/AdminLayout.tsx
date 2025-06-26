import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
// import AdminHeader from './AdminHeader'; // Opsiyonel: Eğer bir header da olacaksa

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <AdminHeader /> // Opsiyonel Header */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <Outlet /> {/* Admin sayfaları burada render edilecek */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
