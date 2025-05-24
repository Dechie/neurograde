import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Department, PageProps } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

interface Props extends PageProps {
    departments?: Department[];
}
export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { departments } = usePage<Props>().props;
    const [submitting, setIsSubmitting] = useState(false);
    const { data, progress, processing, post, setData, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        id_number: '',
        academic_year: '',
        department: '',
    });

    const studentImage = `/student.jpg?t=${Date.now()}`;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Submitted', data);

        setIsSubmitting(true);
        post(route('student-register.store'), {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <div className="from-background to-muted fixed inset-0 overflow-y-auto bg-gradient-to-br">
            {/* <div className="h-screen w-full p-4 sm:p-6 md:p-10"> */}
                <Card className="h-screen  my-4 mx-auto w-full max-w-2xl overflow-hidden bg-white shadow-xl">
                    <div className="flex w-full flex-col px-6 py-2 sm:px-10 md:px-16">
                        <CardHeader className="mb-3 space-y-2">
                            <CardTitle className="text-primary text-2xl font-bold sm:text-3xl">Create a Student Account</CardTitle>
                            <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                Enter your details to sign up as a student
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit} className="w-full">
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="flex flex-col">
                                        <Label htmlFor="first_name" className="mb-2">First Name</Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            type="text"
                                            required
                                        />
                                        {errors.first_name && <div>{errors.first_name}</div>}
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor="last_name" className="mb-2">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            type="text"
                                            required
                                        />
                                        {errors.last_name && <div>{errors.last_name}</div>}
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor="email" className="mb-2">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            type="email"
                                            required
                                        />
                                        {errors.email && <div>{errors.email}</div>}
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor="department_id" className="mb-2">Department</Label>
                                        <select
                                            id="department_id"
                                            name="department"
                                            value={data.department}
                                            required
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="w-full rounded border px-3 py-2 text-sm"
                                        >
                                            <option value="">Select Department</option>
                                            {departments?.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department && <div>{errors.department}</div>}
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor="id_number" className="mb-2">ID Number</Label>
                                        <Input
                                            id="id_number"
                                            name="id_number"
                                            value={data.id_number}
                                            onChange={(e) => setData('id_number', e.target.value)}
                                            type="text"
                                            required
                                        />
                                        {errors.id_number && <div>{errors.id_number}</div>}
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor="academic_year" className="mb-2">Academic Year</Label>
                                        <Input
                                            id="academic_year"
                                            name="academic_year"
                                            value={data.academic_year}
                                            onChange={(e) => setData('academic_year', e.target.value)}
                                            type="text"
                                            required
                                        />
                                        {errors.academic_year && <div>{errors.academic_year}</div>}
                                    </div>

                                    <div className="relative flex flex-col">
                                        <Label htmlFor="password" className="mb-2">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="text-muted-foreground absolute top-7 right-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                        {errors.password && <div>{errors.password}</div>}
                                    </div>

                                    <div className="relative flex flex-col">
                                        <Label htmlFor="password_confirmation" className='mb-2'>Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="text-muted-foreground absolute top-7 right-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                        {errors.password_confirmation && <div>{errors.password_confirmation}</div>}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-1">
                                    <Checkbox id="terms" required />
                                    <label htmlFor="terms" className="text-muted-foreground text-sm leading-none">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-primary underline">Terms of Service</Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>
                                    </label>
                                </div>
                            </CardContent>

                            <CardFooter className="mt-4 flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary hover:bg-secondary h-11 w-full font-medium text-white"
                                >
                                    Create Account
                                </Button>
                                <div className="text-muted-foreground text-center text-sm">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-primary hover:text-primary/80 font-medium underline transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </div>
                </Card>
            </div>
        // </div>
    );
}
