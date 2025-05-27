'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateExamForm } from './CreateExamForm';
import type { ClassRoom } from '@/types/index';
import { useToast } from '@/components/ui/use-toast';
import { router } from '@inertiajs/react';

interface CreateExamDialogProps {
  classes: ClassRoom[]; 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExamCreated: () => void;
}

export function CreateExamDialog({ 
  classes, 
  open, 
  onOpenChange,
  onExamCreated 
}: CreateExamDialogProps) {
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    try {
      await router.post(route('teacher.tests.store'), data, {
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "Success",
            description: "Exam created successfully!",
            variant: "default"
          });
          onExamCreated();
        },
        onError: (errors) => {
          toast({
            title: "Error",
            description: "Failed to create exam. Please try again.",
            variant: "destructive"
          });
          console.error('Error creating exam:', errors);
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create exam. Please try again.",
        variant: "destructive"
      });
      console.error('Error creating exam:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Exam</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto p-1">
          <CreateExamForm 
            classes={classes} 
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}