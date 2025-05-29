#!/usr/bin/env bash

# Usage: ./inspect_commit.sh <commit-hash> [repo-path]
# Example: ./inspect_commit.sh 45978d37a68095c388313726d0e1371ac40c02f5 /path/to/repo

COMMIT_HASH=$1
REPO_PATH=${2:-.}  # Default to current directory if not provided

if [ -z "$COMMIT_HASH" ]; then
    echo "Usage: $0 <commit-hash> [repo-path]"
    exit 1
fi

if [ ! -d "$REPO_PATH/.git" ]; then
    echo "Error: '$REPO_PATH' is not a Git repository."
    exit 1
fi

cd "$REPO_PATH" || exit

echo "🔍 Commit: $COMMIT_HASH"
echo "📁 Repository: $REPO_PATH"
echo

# 1. Basic metadata
echo "📄 Commit Metadata:"
git show -s --format="Hash: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n" "$COMMIT_HASH"
echo

# 2. List changed files
echo "📝 Files changed:"
git show --name-status --format= "$COMMIT_HASH"
echo

# 3. Full diff
echo "🔧 Full Diff:"
git show "$COMMIT_HASH"
echo

# 4. Parent commits
echo "🔗 Parent Commits:"
git log --pretty=%P -n 1 "$COMMIT_HASH"
echo

# 5. Branches and tags containing this commit
echo "🌿 Branches containing this commit:"
git branch --contains "$COMMIT_HASH"
echo

echo "🏷️ Tags containing this commit:"
git tag --contains "$COMMIT_HASH"
echo
