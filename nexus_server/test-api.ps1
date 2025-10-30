# Nexus LMS - API Testing Script
# Run this in PowerShell to test your backend endpoints

$baseUrl = "http://localhost:8001"

Write-Host "🚀 Testing Nexus LMS Backend..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "✅ Health Check: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: List Courses
Write-Host "2️⃣  Testing List Courses..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/courses" -Method GET
    $courseCount = $response.Length
    Write-Host "✅ Found $courseCount courses" -ForegroundColor Green
    if ($courseCount -gt 0) {
        Write-Host "   First course: $($response[0].title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ List Courses Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Create Demo Payment Intent
Write-Host "3️⃣  Testing Demo Payment Intent..." -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    $body = @{
        amount = 4999
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/transactions/payment-intent" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Payment Intent Created" -ForegroundColor Green
    Write-Host "   Payment ID: $($response.paymentIntentId)" -ForegroundColor Gray
    Write-Host "   Amount: `$$($response.amount / 100)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Payment Intent Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Upload URL (requires course/section/chapter IDs)
Write-Host "4️⃣  Testing Cloudinary Upload URL..." -ForegroundColor Yellow
try {
    # First, get a course to get valid IDs
    $courses = Invoke-RestMethod -Uri "$baseUrl/courses" -Method GET
    if ($courses.Length -gt 0) {
        $course = $courses[0]
        $courseId = $course.courseId
        
        if ($course.sections.Length -gt 0 -and $course.sections[0].chapters.Length -gt 0) {
            $sectionId = $course.sections[0].sectionId
            $chapterId = $course.sections[0].chapters[0].chapterId
            
            $uploadUrl = "$baseUrl/courses/$courseId/sections/$sectionId/chapters/$chapterId/get-upload-url"
            $response = Invoke-RestMethod -Uri $uploadUrl -Method POST -Headers $headers
            
            Write-Host "✅ Upload URL Generated" -ForegroundColor Green
            Write-Host "   Cloud Name: $($response.cloudName)" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  No sections/chapters found in course" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  No courses found. Run 'npm run seed' first." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Upload URL Failed: $_" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Backend Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. If any tests failed, check your .env file" -ForegroundColor White
Write-Host "2. Make sure DynamoDB is running (npm run docker:up)" -ForegroundColor White
Write-Host "3. Seed database if no courses found (npm run seed)" -ForegroundColor White
Write-Host "4. For Cloudinary tests, add your credentials to .env" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
