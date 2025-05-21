import { WaitingLayout } from '@/layouts/WaitingLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    status: 'info' | 'success';
    message: string;
    [key: string]: any;
}

export default function WaitingScreen({ status, message }: Props) {
    const { get, processing } = useForm();
    const { toast } = useToast();
    const [isChecking, setIsChecking] = useState(false);

    // Show initial status message
    useEffect(() => {
        if (status === 'success') {
            toast({
                title: "Success!",
                description: message,
            });
            const timer = setTimeout(() => {
                router.visit(route('student.dashboard'));
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            toast({
                title: "Status Update",
                description: message,
                variant: "destructive",
            });
        }
    }, [status, message]);

    // Poll for status updates every 30 seconds
    useEffect(() => {
        console.log('Setting up polling interval');
        const interval = setInterval(() => {
            console.log('Polling: Checking status...');
            checkStatus();
        }, 30000);

        return () => {
            console.log('Cleaning up polling interval');
            clearInterval(interval);
        };
    }, []);

    const checkStatus = () => {
        console.log('checkStatus called');
        setIsChecking(true);
        console.log('isChecking set to true');

        router.get(route('student.check-status'), {}, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => {
                console.log('Request started');
            },
            onSuccess: (page) => {
                console.log('Request succeeded:', page);
                const props = page.props as Props;
                console.log('Page props:', props);

                if (props.status === 'success') {
                    console.log('Status is success, showing success toast');
                    toast({
                        title: "Success!",
                        description: props.message,
                    });
                    console.log('Setting up redirect timer');
                    const timer = setTimeout(() => {
                        console.log('Redirecting to dashboard');
                        router.visit(route('student.dashboard'));
                    }, 2000);
                    return () => clearTimeout(timer);
                } else {
                    console.log('Status is info, showing info toast');
                    toast({
                        title: "Status Update",
                        description: props.message,
                        variant: "destructive",
                    });
                }
            },
            onError: (errors) => {
                console.log('Request failed:', errors);
                toast({
                    title: "Error",
                    description: "Failed to check status. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                console.log('Request finished');
                setIsChecking(false);
                console.log('isChecking set to false');
            }
        });
    };

    return (
        <WaitingLayout>
            <div className="container mx-auto py-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Welcome to NeuroGrade!</CardTitle>
                        <CardDescription>
                            Your account is being set up. Please wait while an administrator assigns you to a class.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                        <p className="text-center text-muted-foreground">
                            This page will automatically refresh when you are assigned to a class.
                            You will then be redirected to your dashboard.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    console.log('Button clicked');
                                    checkStatus();
                                }}
                                disabled={isChecking}
                            >
                                {isChecking ? 'Checking...' : 'Check Status'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    router.post(route('logout'));
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </WaitingLayout>
    );
} 