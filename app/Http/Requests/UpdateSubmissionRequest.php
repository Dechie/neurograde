<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubmissionRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->isTeacher() && 
               $this->user()->teacher->id === $this->route('submission')->test->teacher_id;
    }

    public function rules()
    {
        return [
            'grade' => [
                'required',
                'numeric',
                'min:0',
                'max:100',
                function ($attribute, $value, $fail) {
                    // Validate that grade is a multiple of 0.5
                    if (fmod($value, 0.5) !== 0.0) {
                        $fail('The grade must be a multiple of 0.5.');
                    }
                }
            ],
            'feedback' => [
                'nullable',
                'string',
                'max:1000',
                function ($attribute, $value, $fail) {
                    // Validate that feedback contains at least 10 characters if provided
                    if ($value && strlen(trim($value)) < 10) {
                        $fail('The feedback must be at least 10 characters long.');
                    }
                }
            ],
            'status' => [
                'required',
                Rule::in(['graded', 'pending'])
            ]
        ];
    }

    public function messages()
    {
        return [
            'grade.required' => 'A grade must be provided.',
            'grade.numeric' => 'The grade must be a number.',
            'grade.min' => 'The grade cannot be less than 0.',
            'grade.max' => 'The grade cannot be more than 100.',
            'feedback.max' => 'The feedback cannot exceed 1000 characters.',
            'status.required' => 'The status is required.',
            'status.in' => 'The status must be either graded or pending.'
        ];
    }
} 