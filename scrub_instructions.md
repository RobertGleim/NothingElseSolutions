# Scrub Committed Secrets — Instructions

Follow these steps to rotate the Web3Forms key and scrub it from the repository history. Do not run these on a shared repo without coordinating with collaborators.

1) Rotate the Web3Forms key in the Web3Forms dashboard immediately (generate a new key and disable the old one).

2) Ensure the replacements mapping is available. For safety the mapping is stored in the gitignored file `secrets/replacements.secret` in this repository. Move that file to a safe location outside the repo before running the scrub.

Example replacement entry (store privately):

```
<old_key>==[REDACTED_WEB3FORMS_KEY]
```

3) Pick one of the following methods to rewrite history.

Option A — git-filter-repo (recommended):

```powershell
# Windows PowerShell (run from a folder outside your repo)
git clone --mirror <REPO_URL> repo.git
cd repo.git
# Install git-filter-repo (pip) if needed: pip install git-filter-repo
git filter-repo --replace-text ../replacements.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

Option B — BFG Repo-Cleaner:

```powershell
# Download BFG (https://rtyley.github.io/bfg-repo-cleaner/)
git clone --mirror <REPO_URL> repo.git
cd repo.git
# Place replacements.txt one level up (same as examples)
java -jar /path/to/bfg.jar --replace-text ../replacements.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

4) After the rewrite, rotate any other keys and update environment variables in Vercel/Render.

5) Inform collaborators to re-clone or reset their local branches:

```powershell
git fetch origin
git reset --hard origin/main
```

Notes:
- The commands above will rewrite history and require a forced push; coordinate with team.
- Back up the repo before running these operations.
- If you prefer, I can prepare and run these steps for you locally — tell me which method you prefer and confirm you have a backup.
