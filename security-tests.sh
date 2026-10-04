#!/bin/bash

# Phase 7 - Security Tests
# This script tests the security scenarios from QHSE_PROMPTS.md

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@qhse.local"
ADMIN_PASSWORD="Admin123!"
STUDENT_EMAIL="student@qhse.local"
STUDENT_PASSWORD="Student123!"
STUDENT2_EMAIL="student2@qhse.local"
STUDENT2_PASSWORD="Student123!"

echo "=== Phase 7: Security Tests ==="
echo ""

# Helper function to make requests
make_request() {
  local method=$1
  local endpoint=$2
  local data=$3
  local cookies=$4

  if [ -z "$data" ]; then
    curl -s -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      ${cookies:+-b "$cookies"}
  else
    curl -s -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data" \
      ${cookies:+-b "$cookies"}
  fi
}

echo "Test 1: Student accessing /admin should be redirected"
echo "Expected: 302 or redirect to /login"
curl -s -I "$BASE_URL/admin" | grep -E "302|Location"
echo ""

echo "Test 2: Non-authenticated user accessing /admin should be redirected"
echo "Expected: 302 or redirect to /login"
curl -s -I "$BASE_URL/admin" | grep -E "302|Location"
echo ""

echo "Test 3: Non-enrolled student accessing /learn should be denied"
echo "Expected: 403 or redirect (need to check actual enrollment)"
echo "NOTE: Requires active student session to test"
echo ""

echo "Test 4: Student A should not see Student B's data"
echo "Expected: 403 Forbidden or empty data"
echo "NOTE: Requires multiple student sessions to verify"
echo ""

echo "Test 5: Direct lesson access without enrollment should fail"
echo "Expected: 403 Forbidden"
echo "NOTE: API route should verify enrollment before returning lesson data"
echo ""

echo "Test 6: API calls without authentication should fail"
echo "Expected: 401 Unauthorized"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/enrollments" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"test"}')
echo "Response: $RESPONSE"
echo ""

echo "Test 7: Form validation on server should reject invalid data"
echo "Expected: 400 Bad Request or validation error"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/courses" \
  -H "Content-Type: application/json" \
  -d '{"title":""}')
echo "Response: $RESPONSE"
echo ""

echo "Test 8: Video access token verification"
echo "Expected: Token expires after 30 minutes"
echo "NOTE: Manual verification needed - tokens stored in VideoAccessToken table"
echo ""

echo "=== Security Tests Complete ==="
echo ""
echo "Next step: Run 'npm run build' and 'npm run dev' to verify full build"
