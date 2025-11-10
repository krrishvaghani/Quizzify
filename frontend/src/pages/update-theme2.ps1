$files = @(
  "QuizView.jsx",
  "QuizEditor.jsx",
  "TakeQuizPublic.jsx",
  "AttemptReview.jsx",
  "CreateRoom.jsx",
  "RoomLobby.jsx",
  "RoomsList.jsx",
  "ManualQuizCreation.jsx",
  "QuizAnalytics.jsx",
  "QuizExport.jsx",
  "Analytics.jsx"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Replace light backgrounds
    $content = $content -replace 'bg-gray-50', 'bg-[#0f1419]'
    $content = $content -replace 'bg-gray-100', 'bg-[#1a1f2e]'
    $content = $content -replace 'bg-white(?![/\-])', 'bg-[#1a1f2e]'
    
    # Fix text colors
    $content = $content -replace 'text-gray-900', 'text-white'
    $content = $content -replace 'text-black', 'text-white'
    
    # Additional gradient replacements
    $content = $content -replace 'from-purple-600 to-blue-600', 'from-cyan-500 via-blue-500 to-purple-500'
    $content = $content -replace 'from-blue-600 to-purple-600', 'from-cyan-500 via-blue-500 to-purple-500'
    
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Updated $file"
  }
}
Write-Host "Comprehensive update completed!"
