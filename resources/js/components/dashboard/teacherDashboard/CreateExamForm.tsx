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

interface CreateExamFormProps {
    classes: ClassRoom[];
    onSubmit: (data: FormData) => Promise<void>;
}

interface CreateExamFormData {
    [key: string]: string | number | undefined;
    title: string;
    problem_statement: string;
    input_spec: string;
    output_spec: string;
    due_date: string;
    class_id: number;
    initial_code?: string;
}

type MarkdownField = 'problem_statement' | 'input_spec' | 'output_spec';

export function CreateExamForm({ classes, onSubmit }: CreateExamFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateExamFormData>({
        title: '',
        problem_statement: '',
        input_spec: '',
        output_spec: '',
        due_date: '',
        class_id: 0,
        initial_code: '',
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

    const handleMarkdownToolbar = (action: string, field: MarkdownField) => {
        const text = data[field] as string;
        const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = text.substring(start, end);

        let newText = text;
        switch (action) {
            case 'bold':
                newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                break;
            case 'italic':
                newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                break;
            case 'code':
                newText = text.substring(0, start) + `\`${selectedText}\`` + text.substring(end);
                break;
            case 'codeblock':
                newText = text.substring(0, start) + `\`\`\`\n${selectedText}\n\`\`\`` + text.substring(end);
                break;
            case 'link':
                newText = text.substring(0, start) + `[${selectedText}](url)` + text.substring(end);
                break;
        }

        setData(field, newText);
        // Reset cursor position after state update
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + (action === 'bold' ? 2 : action === 'codeblock' ? 4 : 1),
                end + (action === 'bold' ? 2 : action === 'codeblock' ? 4 : 1)
            );
        }, 0);
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
                        <MarkdownToolbar field="problem_statement" onAction={(action) => handleMarkdownToolbar(action, 'problem_statement')} />
                        <div className="grid grid-cols-2 gap-4">
                            <Textarea
                                id="problem_statement"
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
                        <MarkdownToolbar field="input_spec" onAction={(action) => handleMarkdownToolbar(action, 'input_spec')} />
                        <div className="grid grid-cols-2 gap-4">
                            <Textarea
                                id="input_spec"
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
                        <MarkdownToolbar field="output_spec" onAction={(action) => handleMarkdownToolbar(action, 'output_spec')} />
                        <div className="grid grid-cols-2 gap-4">
                            <Textarea
                                id="output_spec"
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

                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={processing}>
                        {processing ? (
                            <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Exam'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
