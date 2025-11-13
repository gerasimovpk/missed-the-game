'use client';

import { useEffect } from 'react';
import { initializeGA4 } from '@/lib/ga4';

export function GA4Initializer() {
  useEffect(() => {
    initializeGA4();
  }, []);
  
  return null;
}
