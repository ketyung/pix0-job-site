import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="mx-auto lg:flex lg:justify-center lg:items-center">
          <Link href="/" className="block lg:inline-block hover:text-gray-300 mx-2">Home</Link>
          <Link href="/jobSeeker" className="block lg:inline-block hover:text-gray-300 mx-2">For Job Seekers</Link>
          <Link href="/employer" className="block lg:inline-block hover:text-gray-300 mx-2">For Employers</Link>
          <Link href="/about" className="block lg:inline-block hover:text-gray-300 mx-2">About Us</Link>
          <Link href="/privacy" className="block lg:inline-block hover:text-gray-300 mx-2">Privacy Policy</Link>
      </div>
      <div className="mx-auto mt-4 text-center">
        <p>&copy; 2024 <Link target="_blank" href="https://pix0.xyz">Pix0</Link> Job Site. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
