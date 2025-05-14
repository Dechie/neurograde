import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department, PageProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().min(2, 'Class name must be at least 2 characters'),
    department_id: z.number().min(1, 'Please select a department'),
    max_students: z.number().min(1, 'Maximum students must be at least 1'),
});

interface Props extends PageProps {
    departments?: Department[];
}

export function CreateClassForm() {
    const { departments } = usePage<Props>().props;
    const [imageLoaded, setImageLoaded] = useState(false);
    const { data, processing, post, setData, errors } = useForm({
        department_id: undefined,
        max_student: 30,
    });
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Submitted', data);

        post(route('register.store'), {
        });
    };
    const classImage = `/classroom.jpg?t=${Date.now()}`;

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        // post(route('classes.store'), values);
    }

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
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Class Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Section A" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="department_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    defaultValue={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departments?.map((dept) => (
                                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="max_students"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Maximum Students</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="30"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
                                <Button type="submit" className="w-full">
                                    Create Class
                                </Button>
                            </CardFooter>
                        </form>
                </div>
            </Card>
        </div>
    );
}
