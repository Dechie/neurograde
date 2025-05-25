<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role; // Import the Role model from Spatie
use Tests\TestCase;

class RoleBasedLoginTest extends TestCase
{
    use RefreshDatabase;

    // Helper to create a user with a specific role
    protected function createUserWithRole(string $roleName): User
    {
        // Ensure the role exists in the test database
        Role::findOrCreate($roleName);

        $user = User::factory()->create([
            'email' => "test{$roleName}@email.com",
            'password' => Hash::make('password'), // Use a known password for testing
            'first_name' => 'Test', // Assuming first_name and last_name based on your User model
            'last_name' => ucfirst($roleName),
        ]);
        $user->assignRole($roleName); // Assign the role using Spatie
        return $user;
    }

    /**
     * Test a student can authenticate successfully using the student tab.
     */
    public function test_student_can_authenticate_with_student_role(): void
    {
        $user = $this->createUserWithRole('student');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => 'student', // Send the matching role
        ]);

        $this->assertAuthenticatedAs($user); // Assert that the correct user is authenticated
        // Assuming successful login redirects to the dashboard route
        $response->assertRedirect(route('dashboard'));
    }

    /**
     * Test a teacher can authenticate successfully using the teacher tab.
     */
    public function test_teacher_can_authenticate_with_teacher_role(): void
    {
        $user = $this->createUserWithRole('teacher');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => 'teacher', // Send the matching role
        ]);

        $this->assertAuthenticatedAs($user); // Assert that the correct user is authenticated
        $response->assertRedirect(route('dashboard'));
    }

    /**
     * Test a student cannot authenticate using the teacher tab.
     */
    public function test_student_cannot_authenticate_with_teacher_role(): void
    {
        $user = $this->createUserWithRole('student');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => 'teacher', // Send the WRONG role
        ]);

        $this->assertGuest(); // Assert that the user is NOT authenticated
        // Assert that a validation error is returned for the 'email' field
        $response->assertSessionHasErrors('email');
        // Optionally, assert the specific error message text
        $response->assertSessionHasErrors(['email' => "Your account does not have the teacher role. Please select the correct login tab."]);
    }

    /**
     * Test a teacher cannot authenticate using the student tab.
     */
    public function test_teacher_cannot_authenticate_with_student_role(): void
    {
        $user = $this->createUserWithRole('teacher');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => 'student', // Send the WRONG role
        ]);

        $this->assertGuest(); // Assert that the user is NOT authenticated
        $response->assertSessionHasErrors('email');
        $response->assertSessionHasErrors(['email' => "Your account does not have the student role. Please select the correct login tab."]);
    }

    /**
     * Test users cannot authenticate with invalid password (regardless of role).
     */
    public function test_users_cannot_authenticate_with_invalid_password(): void
    {
        $user = $this->createUserWithRole('student'); // Test with any role

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password', // Invalid password
            'role' => 'student', // Send a role (could be any valid role)
        ]);

        $this->assertGuest(); // Assert that no user is authenticated
        // Expect standard authentication failed error for 'email'
        $response->assertSessionHasErrors('email');
        $response->assertSessionHasErrors(['email' => __('auth.failed')]); // Assert the specific message key
    }

     /**
     * Test users cannot authenticate with non-existent email (regardless of role).
     */
    public function test_users_cannot_authenticate_with_non_existent_email(): void
    {
         // No user exists with this email
        $response = $this->post('/login', [
            'email' => 'nonexistent@email.com',
            'password' => 'password',
            'role' => 'student', // Send a role (could be any valid role)
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email'); // Expect standard authentication failed error
         $response->assertSessionHasErrors(['email' => __('auth.failed')]);
    }

    /**
     * Test login fails if 'role' parameter is missing.
     */
    public function test_login_fails_if_role_parameter_is_missing(): void
    {
         $user = $this->createUserWithRole('student');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            // 'role' is missing
        ]);

        $this->assertGuest();
        // Assert validation error for the missing 'role' field
        $response->assertSessionHasErrors('role');
    }

     /**
     * Test login fails if 'role' parameter is invalid.
     */
    public function test_login_fails_if_role_parameter_is_invalid(): void
    {
         $user = $this->createUserWithRole('student');

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
            'role' => 'admin', // Invalid role value
        ]);

        $this->assertGuest();
        // Assert validation error for the invalid 'role' field
        $response->assertSessionHasErrors('role');
    }

    // You could add tests for rate limiting if needed.
}
