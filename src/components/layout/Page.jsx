import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Page = ({ children }) => {
  return (
    <div className="px-4 py-8 md:p-8">
      {children}
    </div>
  );
};

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="max-lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};