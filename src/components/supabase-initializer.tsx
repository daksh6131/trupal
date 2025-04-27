'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/db';
import { toast } from 'react-hot-toast';
export default function SupabaseInitializer(): React.ReactNode {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Test the Supabase connection
        const {
          data,
          error
        } = await supabase.from('agents').select('count').limit(1);
        if (error) {
          console.error('Supabase connection error:', error);
          toast.error('Failed to connect to database. Some features may not work properly.');
        } else {
          console.log('Supabase connection successful');
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Supabase:', error);
      }
    };
    initializeSupabase();
  }, []);

  // This component doesn't render anything visible
  return null;
}