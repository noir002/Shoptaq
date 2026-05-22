import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#020617] text-on-surface font-body-md antialiased overflow-hidden relative">
      {/* Global Background Glow Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 z-10 ${
          collapsed ? 'ml-[72px]' : 'ml-[280px]'
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
