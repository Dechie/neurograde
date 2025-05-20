<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Teacher;
use App\Models\ClassRoom;
use App\Models\Department;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Test>
 */
class TestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'problem_statement' => fake()->paragraph(),
            'due_date' => fake()->dateTimeBetween('now', '+1 month'),
            'status' => fake()->randomElement(['Upcoming', 'Done']),
            'teacher_id' => 1,
            'class_id' => 1,
            'department_id' => 1,
            'metrics' => json_encode([
                'correctness' => fake()->numberBetween(30, 50),
                'efficiency' => fake()->numberBetween(20, 40),
                'code_style' => fake()->numberBetween(10, 30)
            ]),
        ];
    }
}
