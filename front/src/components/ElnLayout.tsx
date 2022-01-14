import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '@/components/Nav';

import useAuth from '../hooks/useAuth';
import clsx from 'clsx';

interface ElnLayoutProps {
  pageTitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

export default function ElnLayout({
  pageTitle,
  children,
  maxWidth = 'max-w-max',
}: ElnLayoutProps) {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  useEffect(() => {
    if (!isAuth) navigate('/login');
  }, [isAuth, navigate]);

  return (
    <div>
      <Nav />

      {pageTitle && (
        <header className="shadow bg-neutral-100">
          <div className="flex items-center px-3 py-3 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-tight text-neutral-900">
              {pageTitle}
            </h1>
          </div>
        </header>
      )}
      <main>
        <div className={clsx('py-3 mx-auto sm:px-6 lg:px-8', maxWidth)}>
          <div className="px-4 py-3 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
