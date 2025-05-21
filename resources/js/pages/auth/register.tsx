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
            <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                <Card className="flex w-full max-w-[90%] flex-col items-center justify-center overflow-hidden shadow-xl sm:max-w-3xl md:max-w-4xl md:flex-row">
                    <div className="flex w-full md:w-1/2">
                        <img
                            src={studentImage}
                            className={`h-60 w-full rounded-lg object-contain transition-opacity md:h-full ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => {
                                setImageLoaded(true);
                                console.log(`Loaded image: ${studentImage}`);
                            }}
                            onError={(e) => {
                                console.error(`Failed to load image: ${studentImage}`);
                                e.currentTarget.src = 'https://via.placeholder.com/1350x900?text=Student+Image+Not+Found';
                                setImageLoaded(true);
                            }}
                            alt="Student illustration"
                        />
                    </div>
                    <div className="flex w-full flex-col md:w-1/2">
                        <CardHeader className="space-y-2 px-6 pt-6 text-center sm:px-8 sm:pt-8">
                            <CardTitle className="text-primary text-2xl font-bold sm:text-3xl">Create a Student Account</CardTitle>
                            <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                Enter your details to sign up as a student
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="flex-1 space-y-6 px-6 py-6 sm:space-y-8 sm:px-8 sm:py-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            type="text"
                                            required
                                        />
                                        {errors.first_name && <div> {errors.first_name} </div>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last name">Last Name</Label>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            type="text"
                                            required
                                        />
                                        {errors.email && <div>{errors.email}</div>}
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </button>
                                            {errors.password && <div>{errors.password}</div>}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="text-muted-foreground absolute top-2/3 right-3 -translate-y-1/2"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </button>
                                            {errors.password_confirmation && <div>{errors.password_confirmation}</div>}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="id_number">ID Number</Label>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="academic_year">Academic Year</Label>
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
                                    <div className="space-y-w">
                                        <Label htmlFor="department_id">Department</Label>
                                        <select
                                            id="department_id"
                                            name="department_id"
                                            value={data.department}
                                            required
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="bordr w-full rounded bg-white px-3 py-2 text-sm"
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
                                </div>
                                <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox id="terms" required />
                                    <label htmlFor="terms" className="text-muted-foreground text-sm leading-none">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-primary underline">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-primary underline">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="!bg-primary hover:!bg-secondary !text-primary-foreground h-11 w-full font-medium"
                                >
                                    Create Account
                                </Button>
                                <div className="text-muted-foreground pt-2 text-center text-sm">
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
        </div>
    );
}
