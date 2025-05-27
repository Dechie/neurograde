'use client';

import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';
import { InputError } from '@/components/ui/input-error';
import { MarkdownToolbar } from '@/components/ui/markdown-toolbar';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import type { ClassRoom } from '@/types/index';

interface EditExamFormProps {
    classes: ClassRoom[];
    exam: {
        id: number;
        title: string;
        problem_statement: string;
        input_spec: string;
        output_spec: string;
        due_date: string;
        class_id: number;
        published: boolean;
    };
    onSubmit: (data: FormData) => Promise<void>;
}

interface EditExamFormData {
    [key: string]: string | number | boolean | undefined;
    title: string;
    problem_statement: string;
    input_spec: string;
    output_spec: string;
    due_date: string;
    class_id: number;
    published: boolean;
}

type MarkdownField = 'problem_statement' | 'input_spec' | 'output_spec';

export function EditExamForm({ classes, exam, onSubmit }: EditExamFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<EditExamFormData>({
        title: exam.title,
        problem_statement: exam.problem_statement,
        input_spec: exam.input_spec,
        output_spec: exam.output_spec,
        due_date: exam.due_date,
        class_id: exam.class_id,
        published: exam.published,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });
        await onSubmit(formData);
    };

    const handleMarkdownToolbar = (action: string, newValue: string, field: MarkdownField) => {
        setData(field, newValue);
    };

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Exam Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground">
                            Exam Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            className="border-border focus:ring-ring"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    {/* Problem Statement */}
                    <div className="space-y-2">
                        <Label htmlFor="problem_statement" className="text-foreground">
                            Description/Problem Statement (Markdown Supported)
                        </Label>
                        <MarkdownToolbar field="problem_statement" onAction={(action, newValue) => handleMarkdownToolbar(action, newValue, 'problem_statement')} />
                        <div className="grid grid-cols-2 gap-4">
                            <Textarea
                                id="problem_statement"
                                name="problem_statement"
                                className="border-border focus:ring-ring min-h-[400px] font-mono"
                                value={data.problem_statement}
                                onChange={(e) => setData('problem_statement', e.target.value)}
                                required
                                placeholder="Describe the problem using Markdown. Use the buttons above to format your text."
                            />
                            <div className="border rounded-md p-4">
                                <MarkdownRenderer content={data.problem_statement} variant="preview" />
                            </div>
                        </div>
                        <InputError message={errors.problem_statement} />
                    </div>

                    {/* Input Specification */}
                    <div className="space-y-2">
                        <Label htmlFor="input_spec" className="text-foreground">
                            Input Specification
                        </Label>
                        <MarkdownToolbar field="input_spec" onAction={(action, newValue) => handleMarkdownToolbar(action, newValue, 'input_spec')} />
                        <div className="grid grid-cols-2 gap-4">
                            <Textarea
                                id="input_spec"
                                name="input_spec"
                                className="border-border focus:ring-ring min-h-[200px] font-mono"
                                value={data.input_spec}
                                onChange={(e) => setData('input_spec', e.target.value)}
                                required
                                placeholder="Describe the input format and constraints using Markdown..."
                            />
                            <div className="border rounded-md p-4">
                                <MarkdownRenderer content={data.input_spec} variant="preview" />
                            </div>
                        </div>
                        <InputError message={errors.input_spec} />
                    </div>

                    {/* Output Specification */}
                    <div className="space-y-2">
                        <Label htmlFor="output_spec" className="text-foreground">
                            Output Specification
                        </Label>
                        <MarkdownToolbar field="output_spec" onAction={(action, newValue) => handleMarkdownToolbar(action, newValue, 'output_spec')} />
                        <div className="grid grid-cols-2 gap-4">
                            <Textarea
                                id="output_spec"
                                name="output_spec"
                                className="border-border focus:ring-ring min-h-[200px] font-mono"
                                value={data.output_spec}
                                onChange={(e) => setData('output_spec', e.target.value)}
                                required
                                placeholder="Describe the expected output format and requirements using Markdown..."
                            />
                            <div className="border rounded-md p-4">
                                <MarkdownRenderer content={data.output_spec} variant="preview" />
                            </div>
                        </div>
                        <InputError message={errors.output_spec} />
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label htmlFor="due_date" className="text-foreground">
                            Due Date
                        </Label>
                        <Input
                            id="due_date"
                            type="datetime-local"
                            className="border-border focus:ring-ring"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.due_date} />
                    </div>

                    {/* Class Select */}
                    <div className="space-y-2">
                        <Label htmlFor="class_id" className="text-foreground">
                            Assign to Class
                        </Label>
                        <Select value={data.class_id?.toString()} onValueChange={(value) => setData('class_id', Number(value))} required>
                            <SelectTrigger id="class_id" className="border-border focus:ring-ring">
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes?.map((classItem: ClassRoom) => (
                                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                                        {classItem.name} ({classItem.department?.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.class_id} />
                    </div>

                    {/* Published Status */}
                    <div className="space-y-2">
                        <Label htmlFor="published" className="text-foreground">
                            Status
                        </Label>
                        <Select
                            value={data.published ? 'published' : 'draft'}
                            onValueChange={(value) => setData('published', value === 'published')}
                        >
                            <SelectTrigger id="published" className="border-border focus:ring-ring">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                            disabled={processing}
                        >
                            Reset
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={processing}>
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 