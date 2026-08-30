#!/usr/bin/env bash

set -euo pipefail

# مخزن مقصد
REPOSITORY="https://github.com/mohammadhossein-asadi/telmafood.git"

echo "بررسی Git و GitHub CLI..."

command -v git >/dev/null 2>&1 || {
    echo "خطا: Git نصب نیست."
    exit 1
}

command -v gh >/dev/null 2>&1 || {
    echo "خطا: GitHub CLI نصب نیست."
    exit 1
}

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
    echo "خطا: این مسیر یک مخزن Git نیست."
    exit 1
}

# خروج از Rebase نیمه‌کاره بدون تغییر فایل‌های پروژه
if [[ -d ".git/rebase-merge" || -d ".git/rebase-apply" ]]; then
    echo
    echo "Rebase نیمه‌کاره پیدا شد؛ در حال خروج از آن..."
    git rebase --quit 2>/dev/null || true
    rm -rf .git/rebase-merge .git/rebase-apply
fi

echo
echo "بررسی ورود به GitHub..."
gh auth status

echo
echo "تنظیم احراز هویت Git..."
gh auth setup-git

# تنظیم ریموت HTTPS
if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REPOSITORY"
else
    git remote add origin "$REPOSITORY"
fi

# تنظیم فایل‌های غیرقابل‌پیگیری
touch .gitignore

grep -qxF ".freebuff/" .gitignore || echo ".freebuff/" >> .gitignore
grep -qxF "git-push.sh" .gitignore || echo "git-push.sh" >> .gitignore
grep -qxF "git-push.ps1" .gitignore || echo "git-push.ps1" >> .gitignore

BRANCH=$(git branch --show-current)

if [[ -z "$BRANCH" ]]; then
    echo "خطا: شاخه فعلی مشخص نیست."
    exit 1
fi

echo
echo "مخزن مقصد: $REPOSITORY"
echo "شاخه فعلی: $BRANCH"

# نمایش فایل‌های تغییرکرده، به‌جز فایل‌های موقت Freebuff
echo
echo "فایل‌های تغییرکرده:"
git status --short -- ':!.freebuff/'

# افزودن همه تغییرات، به‌جز .freebuff
git add -A -- ':!.freebuff/'

# اگر تغییری برای کامیت وجود داشت
if ! git diff --cached --quiet; then

    if [[ $# -gt 0 ]]; then
        COMMIT_MESSAGE="$*"
    else
        COMMIT_MESSAGE="Update: $(date '+%Y-%m-%d %H:%M:%S')"
    fi

    echo
    echo "ساخت کامیت: $COMMIT_MESSAGE"
    git commit -m "$COMMIT_MESSAGE"
else
    echo
    echo "تغییر جدیدی برای کامیت وجود ندارد."
fi

# دریافت وضعیت جدید ریموت برای محافظت از Push
echo
echo "دریافت آخرین وضعیت GitHub..."
git fetch origin "$BRANCH"

echo
echo "در حال Push به GitHub..."
echo "استفاده از force-with-lease برای هماهنگی تاریخچه..."
git push --force-with-lease -u origin "$BRANCH"

echo
echo "======================================"
echo "عملیات با موفقیت انجام شد."
echo "Repository: $REPOSITORY"
echo "Branch: $BRANCH"
echo "======================================"
