#!/usr/bin/env bash
set -e

if [[ -z "$GLM_API_KEY" ]]; then
  echo "❌ GLM_API_KEY is not set"
  echo "👉 Run: export GLM_API_KEY=\"your_key_here\""
  exit 1
fi

CONFIG_DIR="$HOME/.config/opencode"
CONFIG_FILE="$CONFIG_DIR/config.json"

mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_FILE" <<EOF
{
  "provider": "openai-compatible",
  "model": "glm-4",
  "baseUrl": "https://open.bigmodel.cn/api/paas/v4",
  "apiKey": "$GLM_API_KEY",
  "temperature": 0.1,
  "maxTokens": 8192,
  "topP": 0.9
}
EOF

echo "✅ OpenCode configured with GLM-4"
echo "📍 Config: $CONFIG_FILE"
