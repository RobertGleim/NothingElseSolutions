<#
PowerShell helper to perform history scrub using git-filter-repo or BFG.
Run this from a directory outside your repo. Edit <REPO_URL> first.
#>

$repoUrl = Read-Host 'Enter repository git URL (e.g. https://github.com/your/repo.git)'
$method = Read-Host 'Method: filter-repo or bfg (default filter-repo)'
if (-not $method) { $method = 'filter-repo' }

if ($method -eq 'filter-repo') {
  Write-Host 'Using git-filter-repo (recommended)'
  git clone --mirror $repoUrl repo.git
  Set-Location repo.git
  if (-not (Get-Command git-filter-repo -ErrorAction SilentlyContinue)) {
    Write-Host 'git-filter-repo not found. Install with: pip install git-filter-repo' -ForegroundColor Yellow
  }
  Write-Host 'Running: git filter-repo --replace-text ../replacements.txt'
  git filter-repo --replace-text ../replacements.txt
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  git push --force
} else {
  Write-Host 'Using BFG Repo-Cleaner'
  git clone --mirror $repoUrl repo.git
  Set-Location repo.git
  Write-Host 'Ensure bfg jar is available and update path in script.' -ForegroundColor Yellow
  Read-Host 'Press Enter to continue after placing bfg.jar path in script (or Ctrl+C to cancel)'
  java -jar /path/to/bfg.jar --replace-text ../replacements.txt
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  git push --force
}

Write-Host 'Done. Inform all collaborators to re-clone their local repositories.' -ForegroundColor Green
