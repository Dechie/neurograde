import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { ClassRoom } from "@/types";
import { LoaderCircle, Bold, Italic, Heading2, Code, FileCode, Calculator, ArrowDown, Type, Hash, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useState } from "react";

interface CreateExamFormProps {
  classes: ClassRoom[];
}

interface CreateExamFormData {
  title: string;
  problem_statement: string;
  input_spec: string;
  output_spec: string;
  due_date: string;
  class_id: number | '';
  [key: string]: string | number | undefined;
}

export const CreateExamForm = ({ classes }: CreateExamFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'problem' | 'input' | 'output'>('problem');

  const { data, setData, post, processing, errors, reset } = useForm<CreateExamFormData>({
    title: '',
    problem_statement: '',
    input_spec: '',
    output_spec: '',
    due_date: '',
    class_id: ''
  });

  const insertMarkdown = (field: 'problem_statement' | 'input_spec' | 'output_spec', type: string, value?: string) => {
    const textarea = document.getElementById(field) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = data[field];
    let newText = text;

    switch (type) {
      case 'bold':
        newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
        break;
      case 'italic':
        newText = text.substring(0, start) + '_' + text.substring(start, end) + '_' + text.substring(end);
        break;
      case 'h2':
        const prefix = start > 0 ? '\n' : '';
        newText = text.substring(0, start) + prefix + '## ' + text.substring(start, end) + text.substring(end);
        break;
      case 'code':
        newText = text.substring(0, start) + '`' + text.substring(start, end) + '`' + text.substring(end);
        break;
      case 'codeblock':
        const beforeNewline = start > 0 ? '\n' : '';
        const afterNewline = end < text.length ? '\n' : '';
        newText = text.substring(0, start) + 
                 beforeNewline + 
                 '```\n' + 
                 text.substring(start, end) + 
                 '\n```' + 
                 afterNewline + 
                 text.substring(end);
        break;
      case 'inline-math':
        newText = text.substring(0, start) + '$' + text.substring(start, end) + '$' + text.substring(end);
        break;
      case 'block-math':
        const beforeMath = start > 0 ? '\n' : '';
        const afterMath = end < text.length ? '\n' : '';
        newText = text.substring(0, start) + 
                 beforeMath + 
                 '$$\n' + 
                 text.substring(start, end) + 
                 '\n$$' + 
                 afterMath + 
                 text.substring(end);
        break;
      case 'newline':
        newText = text.substring(0, start) + '\\n' + text.substring(end);
        break;
      case 'bullet':
        const bulletPrefix = start > 0 ? '\n' : '';
        newText = text.substring(0, start) + bulletPrefix + '• ' + text.substring(start, end) + text.substring(end);
        break;
      case 'number':
        const numberPrefix = start > 0 ? '\n' : '';
        newText = text.substring(0, start) + numberPrefix + '1. ' + text.substring(start, end) + text.substring(end);
        break;
      case 'math-symbol':
        if (value) {
          if (value === 'subscript') {
            newText = text.substring(0, start) + '$' + text.substring(start, end) + '_{' + text.substring(end, end) + '}$' + text.substring(end);
          } else if (value === 'superscript') {
            newText = text.substring(0, start) + '$' + text.substring(start, end) + '^{' + text.substring(end, end) + '}$' + text.substring(end);
          } else {
            newText = text.substring(0, start) + '$' + value + '$' + text.substring(end);
          }
        }
        break;
    }

    setData(field, newText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Exam form submitted', data);

    post(route('teacher.tests.store'), {
      onSuccess: () => {
        console.log('Test created successfully!');
        reset();
        toast({
          title: "Success",
          description: "Exam created successfully!",
          variant: "default",
        });
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        toast({
          title: "Error",
          description: "Failed to create exam. Please check the form for errors.",
          variant: "destructive",
        });
      },
      onFinish: () => {
        // Optional: Any cleanup after submission attempt
      }
    });
  };

  const renderMarkdownPreview = (content: string) => {
    return (
      <MarkdownRenderer 
        content={content} 
        variant="preview"
      />
    );
  };

  const MarkdownToolbar = ({ field }: { field: 'problem_statement' | 'input_spec' | 'output_spec' }) => (
    <div className="flex flex-wrap gap-2 mb-2">
      {/* Text Formatting Group */}
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'h2')}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Code Group */}
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'codeblock')}
          title="Code Block"
        >
          <FileCode className="h-4 w-4" />
        </Button>
      </div>

      {/* Math Group */}
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'inline-math')}
          title="Inline Math"
        >
          <Calculator className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Calculator className="h-4 w-4 mr-1" />
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', 'subscript')}>
              Subscript (_)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', 'superscript')}>
              Superscript (^)
            </DropdownMenuItem>
            <DropdownMenuItem className="border-t">
              <span className="text-muted-foreground text-sm">Common Symbols</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\leq')}>
              &le; (leq)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\geq')}>
              &ge; (geq)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\times')}>
              &times; (times)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\div')}>
              &divide; (div)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\pm')}>
              &plusmn; (pm)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\sum')}>
              &sum; (sum)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\prod')}>
              &prod; (prod)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '\\infty')}>
              &infin; (infty)
            </DropdownMenuItem>
            <DropdownMenuItem className="border-t">
              <span className="text-muted-foreground text-sm">Common Expressions</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', 'S_{i}')}>
              S<sub>i</sub> (S_i)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '1 \\leq i < N')}>
              1 &le; i &lt; N
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertMarkdown(field, 'math-symbol', '1 \\leq |S| \\leq 2\\times 10^5')}>
              1 &le; |S| &le; 2&times;10<sup>5</sup>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List Group */}
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'bullet')}
          title="Bullet Point"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertMarkdown(field, 'number')}
          title="Numbered List"
        >
          <Hash className="h-4 w-4" />
        </Button>
      </div>

      {/* Newline */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => insertMarkdown(field, 'newline')}
        title="New Line (\n)"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Card className="border-border">
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
            <MarkdownToolbar field="problem_statement" />
            <div className="grid grid-cols-2 gap-4">
              <Textarea
                id="problem_statement"
                className="border-border focus:ring-ring min-h-[400px] font-mono"
                value={data.problem_statement}
                onChange={(e) => setData('problem_statement', e.target.value)}
                required
                placeholder="Describe the problem using Markdown. Use the buttons above to format your text."
              />
              {renderMarkdownPreview(data.problem_statement)}
            </div>
            <InputError message={errors.problem_statement} />
          </div>

          {/* Input Specification */}
          <div className="space-y-2">
            <Label htmlFor="input_spec" className="text-foreground">
              Input Specification
            </Label>
            <MarkdownToolbar field="input_spec" />
            <div className="grid grid-cols-2 gap-4">
              <Textarea
                id="input_spec"
                className="border-border focus:ring-ring min-h-[200px] font-mono"
                value={data.input_spec}
                onChange={(e) => setData('input_spec', e.target.value)}
                required
                placeholder="Describe the input format and constraints using Markdown..."
              />
              {renderMarkdownPreview(data.input_spec)}
            </div>
            <InputError message={errors.input_spec} />
          </div>

          {/* Output Specification */}
          <div className="space-y-2">
            <Label htmlFor="output_spec" className="text-foreground">
              Output Specification
            </Label>
            <MarkdownToolbar field="output_spec" />
            <div className="grid grid-cols-2 gap-4">
              <Textarea
                id="output_spec"
                className="border-border focus:ring-ring min-h-[200px] font-mono"
                value={data.output_spec}
                onChange={(e) => setData('output_spec', e.target.value)}
                required
                placeholder="Describe the expected output format and requirements using Markdown..."
              />
              {renderMarkdownPreview(data.output_spec)}
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
            <Select
              value={data.class_id?.toString()}
              onValueChange={(value) => setData('class_id', Number(value))}
              required
            >
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

          {/* Grading Criteria Info */}
          <div className="space-y-2">
            <Label className="text-foreground">
              Grading Criteria
            </Label>
            <div className="rounded-md border p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">
                The following grading criteria will be used for all submissions:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Accepted (0) - The solution is correct and meets all requirements</li>
                <li>• Wrong Answer (1) - The solution produces incorrect output</li>
                <li>• Time Limit Exceeded (2) - The solution takes too long to execute</li>
                <li>• Memory Limit Exceeded (3) - The solution uses too much memory</li>
                <li>• Runtime Error (4) - The solution crashes during execution</li>
                <li>• Compile Error (5) - The solution fails to compile</li>
                <li>• Presentation Error (6) - The solution output format is incorrect</li>
              </ul>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={processing}
          >
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
};