import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Department } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { LoaderCircle } from 'lucide-react'; 


interface CreateClassFormProps {
    departments: Department[]; 
    onSuccess?: () => void;
}

interface CreateClassFormData {
    name: string;
    department_id: number | '';
    max_students: number;
    [key: string]: any
}

export function CreateClassForm({ departments, onSuccess }: CreateClassFormProps) { // Accept only departments as prop
    const [imageLoaded, setImageLoaded] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<CreateClassFormData>({
        name: '',
        department_id: '', 
        max_students: 30, 
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Submitted', data);

        post(route('admin.classes.store'), {
            onSuccess: () => {
                reset();
                console.log('Class created successfully!');
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            },
            onFinish: () => {
            },
        });
    };

    const classImage = `/classroom.jpg?t=${Date.now()}`;

   return (
  <div className="flex  items-center justify-center bg-background p-4">
    <Card className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border-0">

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium ">
              Class Name
            </Label>
            <Input
              id="name"
              placeholder="Section A, Grade 10-B"
              className="h-12 rounded-lg"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            <InputError message={errors.name} className="text-sm text-rose-600" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id" className="text-sm font-medium ">
              Department
            </Label>
            <Select
              value={data.department_id?.toString()}
              onValueChange={(value) => setData('department_id', Number(value))}
            >
              <SelectTrigger 
                id="department_id" 
                className="h-12 rounded-lg "
              >
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg border ">
                {departments?.map((dept) => (
                  <SelectItem 
                    key={dept.id} 
                    value={dept.id.toString()}
                    className="hover:bg-primary/10 focus:bg-primary/10"
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.department_id} className="text-sm text-rose-600" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_students" className="text-sm font-medium">
              Maximum Students
            </Label>
            <Input
              id="max_students"
              type="number"
              min="1"
              placeholder="30"
              className="h-12 rounded-lg"
              value={data.max_students}
              onChange={(e) => setData('max_students', Number(e.target.value))}
            />
            <InputError message={errors.max_students} className="text-sm text-rose-600" />
          </div>
        </div>

        <div className="mt-8">
          <Button
            type="submit"
            disabled={processing}
            className="w-full h-12 rounded-lg"
          >
            {processing ? (
              <>
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Class'
            )}
          </Button>
        </div>
      </form>
    </Card>
  </div>
);
}
