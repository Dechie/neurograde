<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SubmissionPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Submission $submission)
    {
        // Teachers can view submissions for tests they created
        return $user->isTeacher() && $user->teacher->id === $submission->test->teacher_id;
    }

    public function update(User $user, Submission $submission)
    {
        // Teachers can update submissions for tests they created
        return $user->isTeacher() && $user->teacher->id === $submission->test->teacher_id;
    }
} 