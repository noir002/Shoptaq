import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen tech-bg text-on-surface font-body-md antialiased overflow-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-primary/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[35%] h-[35%] bg-secondary/10 blur-[100px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-accent/5 blur-[80px] rounded-full" />
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 z-10 ${
          collapsed ? 'ml-[76px]' : 'ml-[268px]'
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 scroll-smooth">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
