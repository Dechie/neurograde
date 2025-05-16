import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Removed react-hook-form and zod imports
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department, PageProps } from '@/types'; // Assuming Department and PageProps types are correct
import { useForm, usePage } from '@inertiajs/react'; // Use useForm from Inertia
import { useState } from 'react';
// Removed zod import
import InputError from '@/components/input-error'; // Assuming you have a generic InputError component
import { Label } from '@/components/ui/label';

interface Props extends PageProps {
    departments: Department[];
    teachers: any[];
}

interface CreateClassFormData {
    name: string;
    department_id: number | ''; // Allow number or initial empty string
    teacher_id: number | ''; // Allow number or initial empty string
    max_students: number;
}

export function CreateClassForm() {
    const { departments, teachers } = usePage<Props>().props;
    const [imageLoaded, setImageLoaded] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        department_id: 0, // Initialize as empty string
        teacher_id: 0, // Initialize as empty string
        max_students: 30, // Initialize with a default value
    });

    // Handle form submission using Inertia's post method
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Submitted', data);

        // Post the form data to the backend route for creating classes
        post(route('admin.classes.store'), {
            onSuccess: () => {
                // Optional: Reset the form or show a success message on success
                reset(); // Reset all fields
                console.log('Class created successfully!');
                // You might want to redirect or show a flash message here
            },
            onError: (errors) => {
                // Inertia automatically populates the 'errors' object
                console.error('Form submission errors:', errors);
                // The InputError components will display the errors
            },
            onFinish: () => {
                // Optional: Actions to perform after the request finishes (success or error)
                // e.g., stop showing a loading spinner if 'processing' isn't sufficient
            },
        });
    };

    const classImage = `/classroom.jpg?t=${Date.now()}`;

    return (
        <div className="flex min-h-screen w-full items-center justify-center sm:p-4">
            <Card className="flex w-full max-w-[90%] flex-col items-center justify-center overflow-hidden shadow-xl sm:max-w-3xl md:max-w-4xl md:flex-row">
                <div className="flex w-full md:w-1/2">
                    <img
                        src={classImage}
                        className={`m-4 h-60 w-full rounded-lg object-contain transition-opacity md:h-full ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/1350x900?text=Classroom+Image+Not+Found';
                            setImageLoaded(true);
                        }}
                        alt="Classroom illustration"
                    />
                </div>
                <div className="flex w-full flex-col md:w-1/2">
                    <CardHeader className="space-y-2 px-6 pt-6 text-center sm:px-8 sm:pt-8">
                        <CardTitle className="text-primary text-2xl font-bold sm:text-3xl">Create New Class</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm sm:text-base">
                            Enter class details to create a new class
                        </CardDescription>
                    </CardHeader>

                    {/* Use a standard form element */}
                    <form onSubmit={handleSubmit}>
                        <CardContent className="flex-1 space-y-6 px-6 py-6 sm:space-y-8 sm:px-8 sm:py-8">
                            {/* Class Name Input */}
                            <div className="space-y-2">
                                {' '}
                                {/* Use simple divs instead of FormField */}
                                <Label htmlFor="name">Class Name</Label> {/* Use standard Label */}
                                <Input
                                    id="name"
                                    placeholder="Section A"
                                    value={data.name} // Bind value to data.name
                                    onChange={(e) => setData('name', e.target.value)} // Update data.name on change
                                />
                                {/* Display error using InputError component */}
                                <InputError message={errors.name} />
                            </div>

                            {/* Department Select */}
                            <div className="space-y-2">
                                {' '}
                                {/* Use simple divs */}
                                <Label htmlFor="department_id">Department</Label> {/* Use standard Label */}
                                <Select
                                    // Bind value to data.department_id (convert to string for Select)
                                    value={data.department_id?.toString()}
                                    // Update data.department_id on change (convert value to number)
                                    onValueChange={(value) => setData('department_id', Number(value))}
                                >
                                    {/* Use standard SelectTrigger and SelectValue */}
                                    <SelectTrigger id="department_id">
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Map over departments prop */}
                                        {departments?.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Display error using InputError component */}
                                <InputError message={errors.department_id} />
                            </div>

                            {/* Teacher Select (Assuming teachers are also passed as props) */}
                            <div className="space-y-2">
                                <Label htmlFor="teacher_id">Assign Teacher</Label>
                                <Select value={data.teacher_id?.toString()} onValueChange={(value) => setData('teacher_id', Number(value))}>
                                    <SelectTrigger id="teacher_id">
                                        <SelectValue placeholder="Select a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers?.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.user?.first_name} {teacher.user?.last_name} {/* Assuming user relationship is loaded */}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.teacher_id} />
                            </div>

                            {/* Maximum Students Input */}
                            <div className="space-y-2">
                                {' '}
                                {/* Use simple divs */}
                                <Label htmlFor="max_students">Maximum Students</Label> {/* Use standard Label */}
                                <Input
                                    id="max_students"
                                    type="number"
                                    min="1"
                                    placeholder="30"
                                    value={data.max_students} // Bind value to data.max_students
                                    onChange={(e) => setData('max_students', Number(e.target.value))} // Update data.max_students on change (convert to number)
                                />
                                {/* Display error using InputError component */}
                                <InputError message={errors.max_students} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
                            <Button type="submit" className="w-full" disabled={processing}>
                                {' '}
                                {/* Disable button while processing */}
                                {processing ? 'Creating...' : 'Create Class'} {/* Show loading text */}
                            </Button>
                        </CardFooter>
                    </form>
                </div>
            </Card>
        </div>
    );
}
