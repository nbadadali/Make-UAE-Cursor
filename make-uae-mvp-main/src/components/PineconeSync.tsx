import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PineconeSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const { toast } = useToast();

  const syncToMakeUaeMvp = async () => {
    if (syncCompleted || isSyncing) return;
    
    setIsSyncing(true);
    console.log('Starting sync to make-uae-cursor Pinecone index...');
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-to-pinecone', {
        body: {},
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('Sync result:', data);
      
      if (data.success) {
        toast({
          title: "Sync Successful",
          description: `${data.successCount} activities synced to make-uae-cursor index`,
        });
        setSyncCompleted(true);
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Error syncing to Pinecone:', error);
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Auto-sync when component mounts
    syncToMakeUaeMvp();
  }, []);

  if (!isSyncing && syncCompleted) {
    return null; // Hide component after successful sync
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {isSyncing && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Syncing to Pinecone...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PineconeSync;
