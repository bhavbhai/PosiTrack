'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function ClientThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the ThemeToggle after component is mounted on client
  if (!mounted) {
    return null;
  }

  return <ThemeToggle />;
} 