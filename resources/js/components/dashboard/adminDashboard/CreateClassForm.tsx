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
}

interface CreateClassFormData {
    name: string;
    department_id: number | '';
    max_students: number;
    [key: string]: any
}

// Modify the component function signature to accept props
export function CreateClassForm({ departments }: CreateClassFormProps) { // Accept only departments as prop
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
                            {/* Class Name Input */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name</Label>
                                <Input id="name" placeholder="Section A" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </div>

                            {/* Department Select */}
                            <div className="space-y-2">
                                <Label htmlFor="department_id">Department</Label>
                                <Select value={data.department_id?.toString()} onValueChange={(value) => setData('department_id', Number(value))}>
                                    <SelectTrigger id="department_id">
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Use imported Department interface in map */}
                                        {departments?.map((dept: Department) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department_id} />
                            </div>

                            {/* Maximum Students Input */}
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
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Class'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </div>
            </Card>
        </div>
    );
}
