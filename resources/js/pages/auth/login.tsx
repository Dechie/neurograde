import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const loginImage = '/login.jpg'; // Ensure this exists in public/
    // Fallback URL (uncomment for testing)
    // const loginImage = 'https://images.unsplash.com/photo-1516321310764-8a2388336560?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to access your dashboard">
            <Head title="Log in" />
            <div className="fixed inset-0 bg-gradient-to-br from-background to-muted overflow-y-auto">
                <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                    <Card className="w-full max-w-[90%] sm:max-w-3xl md:max-w-4xl flex flex-col md:flex-row items-center justify-center overflow-hidden shadow-xl">
                        <div className="w-full md:w-1/2  flex items-center justify-center p-3 sm:p-4 md:p-6">
                            <img
                                src={loginImage}
                                alt="Login illustration"
                                className="w-full h-64 sm:h-80 md:h-full max-h-[500px] rounded-lg object-cover aspect-[4/3]"
                                onError={(e) => {
                                    console.error(`Failed to load image: ${loginImage}`);
                                    e.currentTarget.src = 'https://via.placeholder.com/1350x900?text=Login+Image+Not+Found';
                                }}
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col p-6 sm:p-8">
                            <div className="mb-6 text-center">
                                <h2 className="text-[#primary] text-2xl sm:text-3xl font-bold">Log in to your account</h2>
                                <p className="text-muted-foreground mt-2 text-sm sm:text-md">
                                    Enter your email and password below to access your dashboard
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>
                            )}

                            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={submit}>
                                <div className="grid gap-4 sm:gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={route('password.request')}
                                                    className="ml-auto text-sm"
                                                    tabIndex={5}
                                                >
                                                    Forgot Password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} />
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

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full !bg-primary hover:!bg-secondary !text-primary-foreground"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Log in
                                    </Button>
                                </div>

                                <div className="text-muted-foreground text-center text-sm">
                                    Don't have an account?{' '}
                                    <TextLink href={route('register')} tabIndex={5}>
                                        Sign up
                                    </TextLink>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthLayout>
    );
}