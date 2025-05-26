'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ClassRoom, Test } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface EditExamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classes: ClassRoom[];
    exam: Test;
    onExamUpdated: () => void;
}

export function EditExamDialog({ open, onOpenChange, classes, exam, onExamUpdated }: EditExamDialogProps) {
    const initialData = {
        title: exam.title ?? '',
        problem_statement: exam.problem_statement ?? '',
        input_spec: exam.input_spec ?? '',
        output_spec: exam.output_spec ?? '',
        due_date: exam.due_date
            ? new Date(exam.due_date).toISOString().split('T')[0]
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_id: exam.class_id?.toString() ?? (classes.length > 0 ? classes[0].id.toString() : ''),
        published: exam.published ?? false,
    };

    const { data, setData, put, processing, errors, reset } = useForm(initialData);
 useEffect(() => {
    setData({
        title: exam.title ?? '',
        problem_statement: exam.problem_statement ?? '',
        input_spec: exam.input_spec ?? '',
        output_spec: exam.output_spec ?? '',
        due_date: exam.due_date 
            ? new Date(exam.due_date).toISOString().split('T')[0] 
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        class_id: exam.class_id?.toString() ?? (classes.length > 0 ? classes[0].id.toString() : ''),
        published: exam.published ?? false,
    });
    console.log(data);
}, [exam]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('teacher.tests.update', { test: exam.id }), {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Test updated successfully.',
                });
                onOpenChange(false);
                onExamUpdated();
            },
            onError: (err) => {
                const errorMessage = Object.values(err).flat().join(', ') || 'An error occurred while updating the test.';
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] overflow-y-auto p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Edit Exam</DialogTitle>
                    <DialogDescription>Update the details of your exam.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title*</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Enter exam title"
                            required
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="problem_statement">Problem Statement*</Label>
                        <Textarea
                            id="problem_statement"
                            value={data.problem_statement}
                            onChange={(e) => setData('problem_statement', e.target.value)}
                            placeholder="Enter the problem statement"
                            rows={5}
                            required
                        />
                        {errors.problem_statement && <p className="text-sm text-red-500">{errors.problem_statement}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="input_spec">Input Specification*</Label>
                        <Textarea
                            id="input_spec"
                            value={data.input_spec}
                            onChange={(e) => setData('input_spec', e.target.value)}
                            placeholder="Describe the input requirements"
                            rows={3}
                            required
                        />
                        {errors.input_spec && <p className="text-sm text-red-500">{errors.input_spec}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="output_spec">Output Specification*</Label>
                        <Textarea
                            id="output_spec"
                            value={data.output_spec}
                            onChange={(e) => setData('output_spec', e.target.value)}
                            placeholder="Describe the expected output"
                            rows={3}
                            required
                        />
                        {errors.output_spec && <p className="text-sm text-red-500">{errors.output_spec}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="due_date">Due Date*</Label>
                        <Input
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                        {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="class_id">Class*</Label>
                        <Select value={data.class_id} onValueChange={(value) => setData('class_id', value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((classRoom) => (
                                    <SelectItem key={classRoom.id} value={classRoom.id.toString()}>
                                        {classRoom.name} ({classRoom.department?.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.class_id && <p className="text-sm text-red-500">{errors.class_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Status*</Label>
                        <Select
                            value={data.published ? 'published' : 'draft'}
                            onValueChange={(value) => setData('published', value === 'published')}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

