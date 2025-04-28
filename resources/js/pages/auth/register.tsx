import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const studentImage = `/student.jpg?t=${Date.now()}`;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(Object.fromEntries(formData.entries()));
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-background to-muted overflow-y-auto">
            <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                <Card className="w-full max-w-[90%] sm:max-w-3xl md:max-w-4xl flex flex-col md:flex-row items-center justify-center overflow-hidden shadow-xl">
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
                    <div className="w-full md:w-1/2 flex flex-col">
                        <CardHeader className="space-y-2 px-6 sm:px-8 pt-6 sm:pt-8 text-center">
                            <CardTitle className="text-primary text-2xl sm:text-3xl font-bold">Create a Student Account</CardTitle>
                            <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                Enter your details to sign up as a student
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="flex-1 space-y-6 sm:space-y-8 px-6 sm:px-8 py-6 sm:py-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" name="username" type="text" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="id_number">ID Number</Label>
                                        <Input id="id_number" name="id_number" type="text" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="academic_year">Academic Year</Label>
                                        <Input id="academic_year" name="academic_year" type="text" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Department ID</Label>
                                        <Input id="department_id" name="department_id" type="text" required />
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
                            <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-6 sm:pb-8">
                                <Button
                                    type="submit"
                                    className="h-11 w-full !bg-primary hover:!bg-secondary !text-primary-foreground font-medium"
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