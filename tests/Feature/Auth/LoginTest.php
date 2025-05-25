<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash; // Make sure to import Hash
use Spatie\Permission\Models\Role; // Make sure to import Role
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    // Helper to create a user with a specific role
    protected function createUserWithRole(string $roleName): User
    {
        // Ensure the role exists (or create it if your seeders don't handle this in tests)
        Role::findOrCreate($roleName);

        $user = User::factory()->create([
            'email' => "test{$roleName}@email.com",
            'password' => Hash::make('password'), // Use a known password
            'first_name' => ucfirst($roleName), // Assuming 'name' for teachers
            'last_name' => ucfirst($roleName), // Assuming 'name' for teachers
        ]);
        $user->assignRole($roleName);
        return $user;
    }

    /**
     * Test a student can authenticate successfully.
     */
    public function test_student_can_authenticate(): void
    {
        $user = $this->createUserWithRole('student');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated(); // Assert that a user is now authenticated
        // Since your 'dashboard' route handles role-based redirection,
        // we expect a redirect to the dashboard route name.
        // Inertia will handle the client-side navigation after this.
        $response->assertRedirect(route('dashboard'));
    }

    /**
     * Test a teacher can authenticate successfully.
     */
    public function test_teacher_can_authenticate(): void
    {
        $user = $this->createUserWithRole('teacher');

        $response = $this->post('/login', [
            // Assuming teachers log in by email based on your frontend code snippet
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard'));
    }

     /**
     * Test an admin can authenticate successfully.
     */
    public function test_admin_can_authenticate(): void
    {
        $user = $this->createUserWithRole('admin');

        $response = $this->post('/login', [
             // Assuming admins log in by email
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard'));
    }


    /**
     * Test users cannot authenticate with invalid password.
     */
    public function test_users_cannot_authenticate_with_invalid_password(): void
    {
        $user = $this->createUserWithRole('student'); // Test with any role

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password', // Invalid password
        ]);

        $this->assertGuest(); // Assert that no user is authenticated
        // Expect validation errors for the 'email' field (auth.failed)
        $response->assertSessionHasErrors('email');
    }

     /**
     * Test users cannot authenticate with non-existent email.
     */
    public function test_users_cannot_authenticate_with_non_existent_email(): void
    {
        $response = $this->post('/login', [
            'email' => 'nonexistent@email.com',
            'password' => 'password',
        ]);

        $this->assertGuest();
         $response->assertSessionHasErrors('email'); // Expect auth.failed error
    }

    // You might also want tests for rate limiting if that's critical

}