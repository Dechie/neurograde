<?php
namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Traits\HasRoles; // Make sure your User model uses this trait

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Add validation for the 'role' field sent from the frontend
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'role' => ['required', 'string', 'in:student,teacher'], // Validate the 'role' field
        ];
    }

    /**
     * Attempt to authenticate the request's credentials and check role.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('email', 'password');
        $remember = $this->boolean('remember');
        $expectedRole = $this->input('role');

        \Log::info('Attempting authentication', ['credentials' => $credentials, 'remember' => $remember, 'expected_role' => $expectedRole]);

        // First, try to find the user without logging them in
        $user = \App\Models\User::where('email', $credentials['email'])->first();

        if (!$user) {
            \Log::warning('User not found', ['email' => $credentials['email']]);
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Check role before attempting authentication
        if (!$user->hasRole($expectedRole)) {
            \Log::warning('User role mismatch', ['user_id' => $user->id, 'expected_role' => $expectedRole, 'user_roles' => $user->getRoleNames()]);
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => "Your account does not have the {$expectedRole} role. Please select the correct login tab.",
            ]);
        }

        // Now attempt authentication
        if (!Auth::attempt($credentials, $remember)) {
            \Log::warning('Auth::attempt failed', ['credentials' => $credentials]);
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        \Log::info('Authentication successful', ['user_id' => $user->id, 'role' => $expectedRole]);
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        // This method remains the same, it checks rate limits based on the throttle key
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        // Include the 'role' in the throttle key to differentiate attempts per role/tab
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip().'|'.$this->string('role'));
    }
}

