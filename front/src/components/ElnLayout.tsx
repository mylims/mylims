import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '@/components/Nav';

import useAuth from '../hooks/useAuth';

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
        <header className="bg-neutral-100 shadow">
          <div className="mx-auto flex max-w-screen-2xl items-center px-3 py-3 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-tight text-neutral-900">
              {pageTitle}
            </h1>
          </div>
        </header>
      )}
      <main>
        <div className={clsx('mx-auto py-3 sm:px-6 lg:px-8', maxWidth)}>
          <div className="px-4 py-3 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
