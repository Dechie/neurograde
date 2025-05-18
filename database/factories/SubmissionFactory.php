<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Submission>
 */
// database/factories/SubmissionFactory.php
use App\Models\Submission;

class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition(): array
    {
        return [
            'test_id' => 1, // replace dynamically
            'submission_type' => $this->faker->randomElement(['file', 'editor']),
            'student_id' => 1,
            'code_file_path' => null,
            'code_editor_text' => 'print("Hello World")',
            'submission_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['pending', 'graded']),
        ];
    }
}
