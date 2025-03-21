'use client';

import { useState } from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [isSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed} 
        onClose={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default ClientLayout; 