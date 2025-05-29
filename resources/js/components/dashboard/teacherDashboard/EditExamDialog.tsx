'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditExamForm } from './EditExamForm';
import type { ClassRoom, Test } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { router } from '@inertiajs/react';

interface EditExamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classes: ClassRoom[];
    exam: Test;
    onExamUpdated: () => void;
}

export function EditExamDialog({ open, onOpenChange, classes, exam, onExamUpdated }: EditExamDialogProps) {
    const { toast } = useToast();

    const handleSubmit = async (data: FormData) => {
        try {
            // Convert FormData to a plain object with proper types
            const formData = {
                title: data.get('title') as string,
                problem_statement: data.get('problem_statement') as string,
                input_spec: data.get('input_spec') as string,
                output_spec: data.get('output_spec') as string,
                due_date: data.get('due_date') as string,
                class_id: Number(data.get('class_id')),
                published: data.get('published') === 'true'
            };

            await router.put(route('teacher.tests.update', exam.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    toast({
                        title: "Success",
                        description: "Exam updated successfully!",
                        variant: "default"
                    });
                    onExamUpdated();
                },
                onError: (errors) => {
                    // Show validation errors in the toast
                    const errorMessage = Object.values(errors).flat().join('\n');
                    toast({
                        title: "Validation Error",
                        description: errorMessage || "Failed to update exam. Please check your input.",
                        variant: "destructive"
                    });
                    console.error('Error updating exam:', errors);
                }
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update exam. Please try again.",
                variant: "destructive"
            });
            console.error('Error updating exam:', error);
        }
    };

    // Transform the exam data to match the expected format
    const formattedExam = {
        id: exam.id,
        title: exam.title,
        problem_statement: exam.problem_statement || '',
        input_spec: exam.input_spec || '',
        output_spec: exam.output_spec || '',
        due_date: exam.due_date ? new Date(exam.due_date).toISOString().slice(0, 16) : '',
        class_id: exam.class?.id || 0,
        published: exam.published || false,
    };

    console.log('Original exam data:', exam);
    console.log('Formatted exam data:', formattedExam);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Exam</DialogTitle>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-y-auto p-1">
                    <EditExamForm 
                        classes={classes} 
                        exam={formattedExam}
                        onSubmit={handleSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}