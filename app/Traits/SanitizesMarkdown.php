<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait SanitizesMarkdown
{
    /**
     * Sanitize markdown content to prevent XSS and other attacks
     *
     * @param string|null $content
     * @return string
     */
    protected function sanitizeMarkdown(?string $content): string
    {
        if (empty($content)) {
            return '';
        }

        // Remove any HTML tags
        $content = strip_tags($content);

        // Remove any script tags and their content
        $content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $content);

        // Remove any inline JavaScript
        $content = preg_replace('/javascript:/i', '', $content);

        // Remove any data URLs
        $content = preg_replace('/data:/i', '', $content);

        // Remove any potential XSS vectors
        $content = str_replace(['<', '>'], ['&lt;', '&gt;'], $content);

        // Remove any control characters
        $content = preg_replace('/[\x00-\x1F\x7F]/u', '', $content);

        // Remove any potential SQL injection attempts
        $content = str_replace([';', '--', '/*', '*/'], '', $content);

        // Remove any potential command injection attempts
        $content = str_replace(['|', '&', ';', '>', '<', '`', '$'], '', $content);

        // Remove any potential path traversal attempts
        $content = str_replace(['../', '..\\'], '', $content);

        // Remove any potential file inclusion attempts
        $content = str_replace(['include', 'require', 'include_once', 'require_once'], '', $content);

        // Remove any potential eval attempts
        $content = str_replace(['eval', 'exec', 'system', 'shell_exec'], '', $content);

        // Remove any potential base64 encoded content
        $content = preg_replace('/base64/i', '', $content);

        // Remove any potential hex encoded content
        $content = preg_replace('/0x/i', '', $content);

        // Remove any potential unicode escape sequences
        $content = preg_replace('/\\u[0-9a-fA-F]{4}/', '', $content);

        // Remove any potential null bytes
        $content = str_replace("\0", '', $content);

        // Remove any potential line breaks that could be used for injection
        $content = str_replace(["\r", "\n"], ' ', $content);

        // Remove any potential multiple spaces
        $content = preg_replace('/\s+/', ' ', $content);

        // Trim the content
        $content = trim($content);

        return $content;
    }
} 