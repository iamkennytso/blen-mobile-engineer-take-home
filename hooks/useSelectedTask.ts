import { SelectedTaskContext } from '@/providers/app-providers';
import { useContext } from 'react';

export const useSelectedTask = () => {
  const context = useContext(SelectedTaskContext);
  if (!context) {
    throw new Error('useSelectedTask must be used within a SelectedTaskProvider');
  }
  return context;
};
