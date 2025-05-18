<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
            'id' => $this->faker->numberBetween(1, 1000),
            'teacher_id' => 1, 
            'class_id' => $this->faker->numberBetween(1, 10),
            'title' => "Palindrome",
            'problem_statement' => $this->faker->paragraph(),
            'status' => "Done", 
            'due_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'metrics' => json_encode(fake()->randomElements([
                'time_taken' => fake()->numberBetween(10, 60),
                'errors' => fake()->numberBetween(0, 5),
                'hints_used' => fake()->numberBetween(0, 2)
            ], 3)),
            'created_at' => now(), 
            'updated_at' => now(), 
        ];
    }
}
