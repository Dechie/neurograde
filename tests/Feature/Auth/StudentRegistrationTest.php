<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\Department; // Make sure to import Department
use App\Models\Student;   // Make sure to import Student
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class StudentRegistrationTest extends TestCase // Or whatever you name your test file/class
{
    use RefreshDatabase;

    /**
     * Test a new user can register as a student.
     */
    public function test_new_users_can_register_as_student(): void
    {
        $department = Department::factory()->create(); // Create a department for the student

        $response = $this->post('/student-register', [ // Use the actual student registration URI
            'first_name' => 'Test',
            'last_name' => 'Student',
            'email' => 'student@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'id_number' => 'STU12345', // Student-specific field
            'department' => $department->id, // Department ID
            'academic_year' => '2025/2026', // Student-specific field
        ]);

        // Assert the user was created in the database
        $this->assertDatabaseHas('users', [
            'email' => 'student@example.com',
            'first_name' => 'Test',
            'last_name' => 'Student',
            // Don't assert password directly as it's hashed
        ]);

         // Assert the user has the 'student' role
        $user = User::where('email', 'student@example.com')->first();
        $this->assertTrue($user->hasRole('student'));

        // Assert the related student record was created
        $this->assertDatabaseHas('students', [
            'user_id' => $user->id,
            'id_number' => 'STU12345',
            'department_id' => $department->id,
            'academic_year' => '2025/2026',
        ]);

        // Assert the user is authenticated after registration
        $this->assertAuthenticated();

        // Assert the user is redirected to the dashboard
        $response->assertRedirect(route('dashboard')); // Or to_route('dashboard') based on your controller
    }

}