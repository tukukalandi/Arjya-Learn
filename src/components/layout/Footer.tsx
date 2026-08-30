import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ChevronRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="bg-red-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">EduPortal</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Empowering students with comprehensive study materials, question papers, and high-quality educational videos to achieve academic excellence.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-300">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-300">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Classes', path: '/classes' },
                { name: 'Study Materials', path: '/materials' },
                { name: 'Olympiad', path: '/olympiad' },
                { name: 'Video Corner', path: '/video-corner' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors">
                    <ChevronRight className="h-3 w-3 text-slate-600 group-hover:text-red-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '#' },
                { name: 'Contact Support', path: '#' },
                { name: 'Privacy Policy', path: '#' },
                { name: 'Terms of Service', path: '#' },
                { name: 'FAQ', path: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors">
                    <ChevronRight className="h-3 w-3 text-slate-600 group-hover:text-red-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>123 Education Lane, Knowledge Park, Academic City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-5 w-5 text-red-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-5 w-5 text-red-500 shrink-0" />
                <span>support@eduportal.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium tracking-wide">
            © {currentYear} EDUPORTAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Built for</span>
            <span className="text-red-500 font-semibold flex items-center gap-1">
              Academic Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
