# Batch Dark Theme Update Script
$files = @(
  "QuizView.jsx",
  "QuizEditor.jsx",
  "TakeQuiz.jsx",
  "TakeQuizPublic.jsx",
  "AttemptReview.jsx",
  "CreateRoom.jsx",
  "RoomLobby.jsx",
  "RoomsList.jsx",
  "ManualQuizCreation.jsx",
  "QuizAnalytics.jsx",
  "QuizExport.jsx",
  "Analytics.jsx",
  "AnalyticsDashboard.jsx"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Replace common background colors
    $content = $content -replace 'bg-gray-900(?![/\-])', 'bg-[#0f1419]'
    $content = $content -replace 'bg-gray-800(?![/\-])', 'bg-[#1a1f2e]'
    $content = $content -replace 'bg-slate-900(?![/\-])', 'bg-[#1a1f2e]'
    $content = $content -replace 'bg-slate-800(?![/\-])', 'bg-[#1a1f2e]'
    $content = $content -replace 'bg-gray-700(?![/\-])', 'bg-[#252b3b]'
    $content = $content -replace 'bg-slate-700(?![/\-])', 'bg-gray-800'
    
    # Replace border colors
    $content = $content -replace 'border-slate-700', 'border-gray-800'
    $content = $content -replace 'border-gray-700(?![/\-])', 'border-gray-800'
    
    # Replace button colors - blue to gradient
    $content = $content -replace 'bg-blue-600 hover:bg-blue-700', 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90'
    $content = $content -replace 'bg-blue-500 hover:bg-blue-600', 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:opacity-90'
    
    # Save updated content
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Updated $file"
  }
}
Write-Host "Batch update completed!"
