#!/bin/bash

# Test OpenRouter API with Example 1
# Example: "A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents. Think Stripe meets Tron."

SYSTEM_PROMPT=$(cat /home/user/website-design-tool/prompts/orchestrator_system_prompt.md)
USER_INPUT="A premium dark-mode SaaS dashboard for AI analytics with glass panels and subtle neon accents. Think Stripe meets Tron."

curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${VITE_OPENROUTER_API_KEY}" \
  -d @- <<EOF
{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "system",
      "content": $(echo "$SYSTEM_PROMPT" | jq -Rs .)
    },
    {
      "role": "user",
      "content": $(echo "$USER_INPUT" | jq -Rs .)
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
EOF
