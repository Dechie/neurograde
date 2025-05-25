<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait SanitizesMarkdown
{
    /**
     * Sanitize markdown content while preserving LaTeX expressions
     *
     * @param string $content
     * @return string
     */
    protected function sanitizeMarkdown(string $content): string
    {
        // First, protect LaTeX expressions by replacing them with placeholders
        $latexExpressions = [];
        $content = preg_replace_callback(
            '/\$\$(.*?)\$\$|\$(.*?)\$/s',
            function ($matches) use (&$latexExpressions) {
                $placeholder = 'LATEX_' . count($latexExpressions);
                $latexExpressions[$placeholder] = $matches[0];
                return $placeholder;
            },
            $content
        );

        // Now sanitize the content
        $content = strip_tags($content);
        $content = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');

        // Restore LaTeX expressions
        foreach ($latexExpressions as $placeholder => $expression) {
            $content = str_replace($placeholder, $expression, $content);
        }

        return $content;
    }
} 