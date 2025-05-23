import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react'; // Import useEffect
import { type LoginForm, LoginProps } from '@/types'; // Assuming LoginForm from types file

// Define the specific type for the form data 
// It includes email, password, remember, and the 'role' field
type LoginFormWithRole = {
    email: string; // Assuming email is always required based on your backend rules
    password: string;
    remember: boolean;
    role: 'student' | 'teacher'; // The role field sent to backend
};

export default function Login({ status, canResetPassword }: LoginProps) {
    // Renamed activeTab state to selectedRole
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student'); // State for the selected role
    const [imageLoaded, setImageLoaded] = useState(false);

    const images = {
        student: `/student.jpg?t=${Date.now()}`,
        teacher: `/teacher.jpg?t=${Date.now()}`,
    };

    // Use 'role' in the useForm data initialization
    const { data, setData, post, processing, errors, reset } = useForm<LoginFormWithRole>({
        email: '',
        password: '',
        remember: false,
        role: selectedRole, // Initialize 'role' in form data with the state value
    });

    // Update form data's 'role' when the selectedRole state changes
    useEffect(() => {
        setData('role', selectedRole);
    }, [selectedRole, setData]);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Send the entire data object, which now includes 'role'
        post(route('login-store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="from-background to-muted fixed inset-0 overflow-y-auto bg-gradient-to-br">
            <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                <Card className="flex w-full max-w-[90%] flex-col items-center justify-center overflow-hidden shadow-xl sm:max-w-3xl md:max-w-4xl md:flex-row">
                    <div className="hidden w-full sm:flex md:w-1/2">
                        {/* Use selectedRole for image source */}
                        <img
                            src={images[selectedRole]}
                            key={selectedRole}
                            className={`h-120 w-full rounded-lg object-contain transition-opacity md:h-full${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => {
                                setImageLoaded(true);
                                console.log(`Loaded image: ${images[selectedRole]}`);
                            }}
                            onError={(e) => {
                                console.error(`Failed to load image: ${images[selectedRole]}`);
                                e.currentTarget.src = `https://via.placeholder.com/1350x900?text=${selectedRole}+Image+Not+Found`;
                                setImageLoaded(true);
                            }}
                            alt={`${selectedRole} illustration`}
                        />
                    </div>
                    <div className="flex w-full flex-col p-6 sm:p-8 md:w-1/2">
                        <CardHeader className="space-y-2 text-center">
                            <h2 className="text-primary text-2xl font-bold sm:text-3xl">Log in to Your Account</h2>
                            <p className="text-muted-foreground text-sm sm:text-base">Enter your details to access your dashboard</p>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="flex flex-col gap-4 sm:gap-6">
                                <Tabs
                                    defaultValue="student"
                                    className="w-full"
                                    // Use selectedRole for Tabs value
                                    value={selectedRole}
                                    onValueChange={(value) => {
                                        // Update selectedRole state
                                        setSelectedRole(value as 'student' | 'teacher');
                                        setImageLoaded(false);
                                        console.log(`Switched to ${value} tab`);
                                        // When tab changes, clear errors related to the previous tab's validation
                                        errors.email = undefined; // Clear email error (where role error will be attached)
                                    }}
                                >
                                    <TabsList className="mb-4 grid w-full grid-cols-2 gap-4 bg-white p-2">
                                        <TabsTrigger
                                            value="student"
                                            className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground rounded-md py-2 text-sm font-medium"
                                        >
                                            Student
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="teacher"
                                            className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground rounded-md py-2 text-sm font-medium"
                                        >
                                            Teacher
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Student Login Form */}
                                    <TabsContent value="student" className="space-y-4 sm:space-y-6">
                                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                value={data.email} // Assuming email is always string now
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} /> {/* Error message display */}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                                        Forgot Password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} /> {/* Error message display */}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onClick={() => setData('remember', !data.remember)}
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>
                                    </TabsContent>

                                    {/* Teacher Login Form */}
                                    <TabsContent value="teacher" className="space-y-4 sm:space-y-6">
                                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                value={data.email} // Assuming email is always string now
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Your Email"
                                            />
                                            <InputError message={errors.email} /> {/* Error message display */}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                                        Forgot Password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} /> {/* Error message display */}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onClick={() => setData('remember', !data.remember)}
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                            <CardFooter className="mt-4 flex flex-col space-y-4">
                                <Button
                                    type="submit"
                                    className="!bg-primary hover:!bg-secondary !text-primary-foreground w-full"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Log in
                                </Button>
                                {/* Use selectedRole for the ternary check */}
                                {selectedRole === 'student' || selectedRole === 'teacher' ? (
                                    <div className="text-muted-foreground text-center text-sm">
                                        Don't have an account?{' '}
                                        <TextLink href={route('student-register')} tabIndex={5}>
                                            Sign up
                                        </TextLink>
                                    </div>
                                ) : null}
                            </CardFooter>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}

