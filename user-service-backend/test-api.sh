#!/bin/bash

echo "🧪 Тестирование User Service API"
echo "================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

check_response() {
  local response="$1"
  local expected_status="$2"
  local test_name="$3"
  
  if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ $test_name успешен${NC}"
  else
    echo -e "${RED}❌ $test_name неуспешен${NC}"
    echo "Ответ: $response"
  fi
}

echo ""
echo "1. Проверка здоровья сервиса..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
check_response "$HEALTH_RESPONSE" "healthy" "Health check"

echo ""
echo "2. Получение информации об API..."
API_INFO=$(curl -s "$BASE_URL/api")
check_response "$API_INFO" "true" "API info"

echo ""
echo "3. Регистрация пользователя..."
REGISTER_DATA='{
  "firstName": "Иван",
  "lastName": "Иванов",
  "email": "ivan.test@example.com",
  "password": "Test12345",
  "birthDate": "1990-05-15"
}'

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA")

check_response "$REGISTER_RESPONSE" "true" "User registration"

USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo ""
echo "4. Авторизация пользователя..."
LOGIN_DATA='{
  "email": "ivan.test@example.com",
  "password": "Test12345"
}'

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

check_response "$LOGIN_RESPONSE" "true" "User login"

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo ""
echo "5. Получение текущего пользователя..."
ME_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")

check_response "$ME_RESPONSE" "true" "Get current user"

echo ""
echo "6. Получение пользователя по ID..."
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/api/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

check_response "$USER_RESPONSE" "true" "Get user by ID"

echo ""
echo "7. Обновление пользователя..."
UPDATE_DATA='{
  "firstName": "Иван Обновленный",
  "lastName": "Иванов"
}'

UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/api/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA")

check_response "$UPDATE_RESPONSE" "true" "Update user"

echo ""
echo "8. Смена пароля..."
CHANGE_PASS_DATA='{
  "oldPassword": "Test12345",
  "newPassword": "NewTest12345"
}'

CHANGE_PASS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/users/$USER_ID/password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CHANGE_PASS_DATA")

check_response "$CHANGE_PASS_RESPONSE" "true" "Change password"

echo ""
echo "9. Блокировка пользователя..."
BLOCK_DATA='{
  "isActive": false
}'

BLOCK_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/users/$USER_ID/block" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$BLOCK_DATA")

check_response "$BLOCK_RESPONSE" "true" "Block user"

echo ""
echo "10. Разблокировка пользователя..."
UNBLOCK_DATA='{
  "isActive": true
}'

UNBLOCK_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/users/$USER_ID/block" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UNBLOCK_DATA")

check_response "$UNBLOCK_RESPONSE" "true" "Unblock user"

echo ""
echo "================================="
echo "🎉 Все тесты завершены!"
