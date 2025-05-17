import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react'; // Use useForm from Inertia
import { useState } from 'react';
import { Department, Teacher, User, CreateClassPageProps } from '@/types';

// Define the props expected by the CreateClassForm component itself


// Modify the component function signature to accept props
export function CreateClassForm({ departments, teachers }: CreateClassPageProps) {
    // Accept departments and teachers as props
    // Removed: const { departments, teachers } = usePage<Props>().props;
    // Now departments and teachers are available directly from the function arguments

    const [imageLoaded, setImageLoaded] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Added type argument
        name: '',
        department_id: 0, // Initialize as empty string
        teacher_id: 0, // Initialize as empty string
        max_students: 30, // Initialize with a default value
    });

    // Handle form submission using Inertia's post method
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
            onFinish: () => {},
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

                    <form onSubmit={handleSubmit}>
                        <CardContent className="flex-1 space-y-6 px-6 py-6 sm:space-y-8 sm:px-8 sm:py-8">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name</Label>
                                <Input id="name" placeholder="Section A" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department_id">Department</Label>
                                <Select value={data.department_id?.toString()} onValueChange={(value) => setData('department_id', Number(value))}>
                                    <SelectTrigger id="department_id">
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments?.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="teacher_id">Assign Teacher</Label>
                                <Select value={data.teacher_id?.toString()} onValueChange={(value) => setData('teacher_id', Number(value))}>
                                    <SelectTrigger id="teacher_id">
                                        <SelectValue placeholder="Select a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers?.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.user?.first_name} {teacher.user?.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.teacher_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_students">Maximum Students</Label>
                                <Input
                                    id="max_students"
                                    type="number"
                                    min="1"
                                    placeholder="30"
                                    value={data.max_students}
                                    onChange={(e) => setData('max_students', Number(e.target.value))}
                                />
                                <InputError message={errors.max_students} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Class'}
                            </Button>
                        </CardFooter>
                    </form>
                </div>
            </Card>
        </div>
    );
}
