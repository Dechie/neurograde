import InputError from '@/components/input-error'; // Assuming you have a generic InputError component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming you have a Label component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department, PageProps } from '@/types'; // Assuming Department and PageProps types are correct
import { useForm, usePage } from '@inertiajs/react'; // Use useForm from Inertia
import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react'; // Import icons for password toggle
import { useState } from 'react';
import { route } from 'ziggy-js'; // Import route helper

interface Props extends PageProps {
    departments: Department[];
}

export function TeacherSignupForm() {
    const { departments } = usePage<Props>().props;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // State for password confirmation visibility

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        department_id: 0,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Submitted', data);

        post(route('admin.teachers.store'), {
            onSuccess: () => {
                reset();
                console.log('Teacher created successfully!');
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            },
            onFinish: () => {},
        });
    };

    const teacherImage = `/teacher.jpg?t=${Date.now()}`;

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
            <Card className="flex w-full max-w-[90%] flex-col items-center justify-center overflow-hidden shadow-xl sm:max-w-3xl md:max-w-4xl md:flex-row">
                <div className="flex w-full md:w-1/2">
                    <img
                        src={teacherImage}
                        className={`h-60 w-full rounded-lg object-contain transition-opacity md:h-full ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/1350x900?text=Teacher+Image+Not+Found';
                            setImageLoaded(true);
                        }}
                        alt="Teacher illustration"
                    />
                </div>
                <div className="flex w-full flex-col md:w-1/2">
                    <CardHeader className="space-y-2 px-6 pt-6 text-center sm:px-8 sm:pt-8">
                        <CardTitle className="text-primary text-2xl font-bold sm:text-3xl">Create a Teacher Account</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm sm:text-base">
                            Enter teacher details to register as a teacher
                        </CardDescription>
                    </CardHeader>

                    {/* Use a standard form element */}
                    <form onSubmit={handleSubmit}>
                        <CardContent className="flex-1 space-y-6 px-6 py-6 sm:space-y-8 sm:px-8 sm:py-8">
                            <div className="space-y-4">
                                {/* First Name Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        placeholder="First Name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                {/* Last Name Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        placeholder="Last Name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email" // Use type="email" for email input
                                        placeholder="teacher@gmail.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="pr-10" // Add padding for the icon
                                        />
                                        <button
                                            type="button"
                                            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Password Confirmation Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showPasswordConfirmation ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="pr-10" // Add padding for the icon
                                        />
                                        <button
                                            type="button"
                                            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        >
                                            {showPasswordConfirmation ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {/* Error for password_confirmation is often attached to password */}
                                    {/* <InputError message={errors.password_confirmation} /> */}
                                </div>

                                {/* Department Select */}
                                <div className="space-y-2">
                                    <Label htmlFor="department_id">Department</Label>
                                    <Select
                                        value={data.department_id?.toString()} // Bind value
                                        onValueChange={(value) => setData('department_id', Number(value))} // Update value
                                    >
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
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
                            <Button type="submit" className="w-full" disabled={processing}>
                                {' '}
                                {/* Disable while processing */}
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </div>
            </Card>
        </div>
    );
}
