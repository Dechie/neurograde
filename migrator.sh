for w in users departments admins students teachers classes tests class_students test_student submissions feedbacks ai_grading_results grades analytics
do
    php artisan make:migration "create_${w}_table";
done