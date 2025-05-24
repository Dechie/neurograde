import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { ClassRoom } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreateExamFormProps {
  classes: ClassRoom[];
}

interface CreateExamFormData {
  title: string;
  problem_statement: string; // This will now support Markdown
  input_spec: string;       // New field for input specification
  output_spec: string;      // New field for output specification
  due_date: string;
  class_id: number | '';
  [key: string]: string | number | undefined;
}

export const CreateExamForm = ({ classes }: CreateExamFormProps) => {
  const { toast } = useToast();

  const { data, setData, post, processing, errors, reset } = useForm<CreateExamFormData>({
    title: '',
    problem_statement: '', // Initialize for Markdown content
    input_spec: '',       // Initialize new field
    output_spec: '',      // Initialize new field
    due_date: '',
    class_id: ''
  });

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

          {/* Problem Statement (with Markdown support) */}
          <div className="space-y-2">
            <Label htmlFor="problem_statement" className="text-foreground">
              Description/Problem Statement (Markdown Supported)
            </Label>
            <Textarea
              id="problem_statement"
              className="border-border focus:ring-ring min-h-[200px] font-mono" // Revert to monospace for Markdown editing
              value={data.problem_statement}
              onChange={(e) => setData('problem_statement', e.target.value)}
              required
              placeholder="Describe the problem using Markdown. Use **bold**, `code`, ```python blocks```, etc."
            />
            <InputError message={errors.problem_statement} />
          </div>

          {/* Input Specification */}
          <div className="space-y-2">
            <Label htmlFor="input_spec" className="text-foreground">
              Input Specification
            </Label>
            <Textarea
              id="input_spec"
              className="border-border focus:ring-ring min-h-[120px]"
              value={data.input_spec}
              onChange={(e) => setData('input_spec', e.target.value)}
              required
              placeholder="Describe the input format and constraints..."
            />
            <InputError message={errors.input_spec} />
          </div>

          {/* Output Specification */}
          <div className="space-y-2">
            <Label htmlFor="output_spec" className="text-foreground">
              Output Specification
            </Label>
            <Textarea
              id="output_spec"
              className="border-border focus:ring-ring min-h-[120px]"
              value={data.output_spec}
              onChange={(e) => setData('output_spec', e.target.value)}
              required
              placeholder="Describe the expected output format and requirements..."
            />
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