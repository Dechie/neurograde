<?php

test('student registration screen can be rendered', function () {
    $response = $this->get('/student-register');

    $response->assertStatus(200);
});

