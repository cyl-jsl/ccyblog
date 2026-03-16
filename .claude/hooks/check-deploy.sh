#!/bin/bash
# Post-push deploy status checker for ccyblog
# Waits for the GitHub Actions deploy workflow to complete and reports status.
# Uses JSON additionalContext so PostToolUse hook output is visible to Claude.

input=$(cat /dev/stdin)

# Only trigger on Bash tool calls containing git push
tool_name=$(echo "$input" | jq -r '.tool_name // empty')
command=$(echo "$input" | jq -r '.tool_input.command // empty')

if [ "$tool_name" != "Bash" ] || ! echo "$command" | grep -q 'git push'; then
  exit 0
fi

# Wait for the run to appear
sleep 5

# Get the latest run status
run_info=$(gh run list --limit 1 --json status,conclusion,name 2>/dev/null)
if [ -z "$run_info" ] || [ "$run_info" = "[]" ]; then
  exit 0
fi

status=$(echo "$run_info" | jq -r '.[0].status')
name=$(echo "$run_info" | jq -r '.[0].name')

# If still in progress, wait and poll (max 120s)
elapsed=0
while [ "$status" = "in_progress" ] || [ "$status" = "queued" ]; do
  if [ $elapsed -ge 120 ]; then
    jq -n --arg msg "⏳ $name still running after 120s — check manually with: gh run list --limit 1" \
      '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":$msg}}'
    exit 0
  fi
  sleep 10
  elapsed=$((elapsed + 10))
  run_info=$(gh run list --limit 1 --json status,conclusion,name 2>/dev/null)
  status=$(echo "$run_info" | jq -r '.[0].status')
done

conclusion=$(echo "$run_info" | jq -r '.[0].conclusion')

if [ "$conclusion" = "success" ]; then
  msg="✅ $name deployed successfully."
else
  msg="❌ $name failed (conclusion: $conclusion). Run: gh run view --log"
fi

jq -n --arg msg "$msg" '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":$msg}}'
exit 0
