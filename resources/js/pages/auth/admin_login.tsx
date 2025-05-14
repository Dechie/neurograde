import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginProps, type LoginForm } from '@/types';
import { useForm } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const image = `/student.jpg?t=${Date.now()}`;

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        name: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin-store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="from-background to-muted fixed inset-0 overflow-y-auto bg-gradient-to-br">
            <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                <Card className="flex w-full max-w-[90%] flex-col items-center justify-center overflow-hidden shadow-xl sm:max-w-3xl md:max-w-4xl md:flex-row">
                    <div className="hidden w-full sm:flex md:w-1/2">
                        <img
                            src={image}
                            className={`h-120 w-full rounded-lg object-contain transition-opacity md:h-full${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => {
                                setImageLoaded(true);
                                console.log(`Loaded image: $image`);
                            }}
                            onError={(e) => {
                                console.error(`Failed to load image: $images`);
                                e.currentTarget.src = `https://via.placeholder.com/1350x900?text=Image+Not+Found`;
                                setImageLoaded(true);
                            }}
                        />
                    </div>
                    <div className="flex w-full flex-col p-6 sm:p-8 md:w-1/2">
                        <CardHeader className="space-y-2 text-center">
                            <h2 className="text-primary text-2xl font-bold sm:text-3xl">Admin Login</h2>
                            <p className="text-muted-foreground text-sm sm:text-base">Enter your details to access your dashboard</p>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="flex flex-col gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email || ''}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-2">
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
                            </CardFooter>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}
