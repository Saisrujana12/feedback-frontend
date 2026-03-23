import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Github, Twitter, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Get to Know Us',
      links: [
        { label: 'About FeedbackVortex', path: '#' },
        { label: 'Careers', path: '#' },
        { label: 'Press Releases', path: '#' },
        { label: 'Science & Innovation', path: '#' },
      ],
    },
    {
      title: 'Connect with Us',
      links: [
        { label: 'Facebook', path: '#' },
        { label: 'Twitter', path: '#' },
        { label: 'Instagram', path: '#' },
        { label: 'LinkedIn', path: '#' },
      ],
    },
    {
      title: 'Make Money with Us',
      links: [
        { label: 'Sell on FeedbackVortex', path: '#' },
        { label: 'Become an Affiliate', path: '#' },
        { label: 'Advertise Your Products', path: '#' },
        { label: 'Self-Publish with Us', path: '#' },
      ],
    },
    {
      title: 'Let Us Help You',
      links: [
        { label: 'Your Account', path: '/dashboard' },
        { label: 'Your Orders', path: '#' },
        { label: 'Shipping Rates & Policies', path: '#' },
        { label: 'Help Center', path: '#' },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-black/5 dark:border-white/10 overflow-hidden relative z-10">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full py-4 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 group"
      >
        <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50/50 dark:bg-black/40 backdrop-blur-md py-8 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-all shadow-md">
              <MessageSquare size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-gray-600 dark:from-white dark:to-gray-400">
              FeedbackVortex
            </span>
          </Link>

          <div className="text-xs text-gray-500 dark:text-gray-500 flex flex-wrap justify-center gap-4">
            <Link to="#" className="hover:text-indigo-500 transition-colors">Conditions of Use & Sale</Link>
            <Link to="#" className="hover:text-indigo-500 transition-colors">Privacy Notice</Link>
            <Link to="#" className="hover:text-indigo-500 transition-colors">Interest-Based Ads</Link>
            <span>© 2026, FeedbackVortex.com, Inc. or its affiliates</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"><Github size={18} /></a>
            <a href="#" className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
