<?php

namespace Tests\Feature\Api\Admin; // Adjust namespace based on file location

use App\Models\User;
use App\Models\Department;
use App\Models\Teacher; // Make sure to import Teacher
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission; // If using permissions
use Tests\TestCase;

class CreateTeacherTest extends TestCase // Or whatever you name your test file/class
{
    use RefreshDatabase;

    // Helper to create an admin user with required permissions/roles
    protected function createAdminUser(): User
    {
        // Ensure roles/permissions exist
        $adminRole = Role::findOrCreate('admin');
        // If createTeacher requires a specific permission, assign it to the admin role
        // $createTeacherPermission = Permission::findOrCreate('create teachers');
        // $adminRole->givePermissionTo($createTeacherPermission);

        $adminUser = User::factory()->create();
        $adminUser->assignRole('admin');
        return $adminUser;
    }

    /**
     * Test an authenticated admin can create a new teacher.
     */
    public function test_authenticated_admin_can_create_teacher(): void
    {
        $adminUser = $this->createAdminUser();
        $department = Department::factory()->create();

        // Act as the admin user and send a POST request to the API endpoint
        $response = $this->actingAs($adminUser, 'web')->postJson('/api/admin/teachers', [ // Adjust URI and guard if using 'api' guard
            'first_name' => 'New',
            'last_name' => 'Teacher',
            'email' => 'teacher@email.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'department_id' => $department->id,
        ]);

        // Assert a 201 Created status code for a successful API resource creation
        $response->assertStatus(201);

        // Assert the user was created in the database
        $this->assertDatabaseHas('users', [
            'email' => 'teacher@email.com',
            'first_name' => 'New',
            'last_name' => 'Teacher',
        ]);

        // Assert the user has the 'teacher' role
        $user = User::where('email', 'teacher@email.com')->first();
        $this->assertTrue($user->hasRole('teacher'));

        // Assert the related teacher record was created
        $this->assertDatabaseHas('teachers', [
            'user_id' => $user->id,
            'created_by' => $adminUser->id, // Verify created_by field
            'department_id' => $department->id,
        ]);

        // Assert the admin user is still the authenticated user (the new teacher is NOT logged in)
        $this->assertAuthenticatedAs($adminUser);

        // Assert the structure and content of the JSON response
        $response->assertJson([
            'message' => 'Teacher created successfully',
            'teacher' => [
                'user' => [
                    'email' => 'teacher@email.com',
                    'first_name' => 'New',
                    'last_name' => 'Teacher',
                ],
                'department' => [
                    'id' => $department->id,
                    // Add other department fields you expect in the response
                ],
                 // Add other teacher fields you expect in the response
            ],
        ]);
        // You might also assert the JSON structure more generally
        $response->assertJsonStructure([
            'message',
            'teacher' => [
                'id',
                'user_id',
                'created_by',
                'department_id',
                'user' => ['id', 'first_name', 'last_name', 'email', /* etc. */],
                'department' => ['id', 'name', /* etc. */],
            ],
        ]);
    }

     /**
     * Test guests cannot create a teacher (assuming endpoint is protected).
     */
    public function test_guests_cannot_create_teacher(): void
    {
        $department = Department::factory()->create();

        $response = $this->postJson('/api/admin/teachers', [ // Adjust URI
            'first_name' => 'Guest',
            'last_name' => 'Attempt',
            'email' => 'guest@email.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'department_id' => $department->id,
        ]);

        // Assert a 401 Unauthorized or 403 Forbidden status code
        $response->assertStatus(401); // Or 403 if using middleware that returns 403

        // Assert the user was NOT created
        $this->assertDatabaseMissing('users', ['email' => 'guest@email.com']);
    }

}