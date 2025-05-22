import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; // Import CardFooter
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import InputError from "@/components/input-error"; // Assuming you have an InputError component
import { useForm } from "@inertiajs/react"; // Import useForm
import { route } from "ziggy-js"; // Import route helper
import { ClassRoom } from "@/types"; // Import ClassRoom type
import { LoaderCircle } from "lucide-react"; // Import LoaderCircle icon
import { useToast } from "@/components/ui/use-toast"; // Import useToast


// Define the props expected by this form component
interface CreateExamFormProps {
  classes: ClassRoom[]; // Expecting an array of classes to populate the select
}

// Define the type for the form data expected by the backend createTest endpoint
interface CreateExamFormData {
  title: string;
  problem_statement: string;
  due_date: string; // Send as string, backend will cast to date
  class_id: number | ''; // Store selected class ID, allow number or empty string
  [key: string]: string | number | undefined;
}


export const CreateExamForm = ({ classes }: CreateExamFormProps) => { // Accept classes as prop
  const { toast } = useToast(); // Initialize toast

  // Use Inertia's useForm hook
  const { data, setData, post, processing, errors, reset } = useForm<CreateExamFormData>({
    title: '',
    problem_statement: '',
    due_date: '',
    class_id: '' // Initialize class_id as empty string
  });

  // Handle form submission using Inertia's post method
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Exam form submitted', data);

    // Post the form data to the backend route for creating tests
    post(route('teacher.tests.store'), { // Use the correct route name
      onSuccess: () => {
        console.log('Test created successfully!');
        reset(); // Reset form fields on success
        toast({
          title: "Success",
          description: "Exam created successfully!",
          variant: "default",
        });
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        // Inertia automatically populates the 'errors' object
        // InputError components will display the errors
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

  // State for managing the metrics input if it's a complex UI (optional)
  // For now, we'll use a simple textarea for JSON input.
  // const [metricsInput, setMetricsInput] = useState('{"grading_criteria": "...", "weight": 100}');


  return (
    <Card className="border-border"> {/* Assuming you want the form wrapped in a Card */}
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
              value={data.title} // Bind value to data.title
              onChange={(e) => setData('title', e.target.value)} // Update data.title
              required
            />
            <InputError message={errors.title} /> {/* Display error */}
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <Label htmlFor="problem_statement" className="text-foreground">
              Description/Problem Statement
            </Label>
            <Textarea
              id="problem_statement"
              className="border-border focus:ring-ring min-h-[120px]"
              value={data.problem_statement} // Bind value to data.problem_statement
              onChange={(e) => setData('problem_statement', e.target.value)} // Update data.problem_statement
              required
            />
            <InputError message={errors.problem_statement} /> {/* Display error */}
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
              value={data.due_date} // Bind value to data.due_date
              onChange={(e) => setData('due_date', e.target.value)} // Update data.due_date
              required
            />
            <InputError message={errors.due_date} /> {/* Display error */}
          </div>

          {/* Class Select */}
          <div className="space-y-2">
            <Label htmlFor="class_id" className="text-foreground">
              Assign to Class
            </Label>
            <Select
              value={data.class_id?.toString()} // Bind value (convert number to string)
              onValueChange={(value) => setData('class_id', Number(value))} // Update value (convert string to number)
              required // Mark as required
            >
              <SelectTrigger id="class_id" className="border-border focus:ring-ring">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {/* Map over the classes prop */}
                {classes?.map((classItem: ClassRoom) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name} ({classItem.department?.name}) {/* Show class name and department */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.class_id} /> {/* Display error */}
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
            disabled={processing} // Disable button while processing
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
