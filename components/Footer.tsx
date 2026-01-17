
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-6 border-t border-white/5 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-play text-red-600 text-xs"></i>
          <span>&copy; {new Date().getFullYear()} AutoShorts AI. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-red-500 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
