import React from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalVideoBackground } from './GlobalVideoBackground';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-transparent text-white selection:bg-white selection:text-black">
      {/* 1. Global Fixed Background Video & Overlay */}
      <GlobalVideoBackground />

      {/* 2. Navbar */}
      <Navbar />

      {/* 3. Page Content Area */}
      <main className="relative z-10 flex-1 flex flex-col px-5 sm:px-6 md:px-10 lg:px-14 pb-12">
        <Outlet />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};
