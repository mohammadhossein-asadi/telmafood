#!/usr/bin/env bash

set -euo pipefail

# آدرس مخزن مقصد
REPOSITORY="https://github.com/mohammadhossein-asadi/telmafood.git"

echo "بررسی ابزارهای موردنیاز..."

command -v git >/dev/null 2>&1 || {
    echo "خطا: Git نصب نیست."
    exit 1
}

command -v gh >/dev/null 2>&1 || {
    echo "خطا: GitHub CLI نصب نیست."
    exit 1
}

# بررسی مخزن Git
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
    echo "خطا: این مسیر یک مخزن Git نیست."
    exit 1
}

# اگر Rebase قبلی وجود دارد، ادامه نده
if [[ -d ".git/rebase-merge" || -d ".git/rebase-apply" ]]; then
    echo "خطا: یک Rebase نیمه‌کاره وجود دارد."
    echo "ابتدا برنامه‌های مرتبط با پروژه را ببند و سپس اجرا کن:"
    echo
    echo "  rm -rf .freebuff"
    echo "  git rebase --abort"
    exit 1
fi

echo
echo "بررسی ورود به GitHub..."
gh auth status

echo
echo "تنظیم احراز هویت Git..."
gh auth setup-git

# تنظیم ریموت روی HTTPS
if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REPOSITORY"
else
    git remote add origin "$REPOSITORY"
fi

# جلوگیری از اضافه‌شدن فایل‌های موقت و خود اسکریپت به کامیت
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

# حذف فایل‌های موقت Freebuff
# فقط فایل‌های داخل .freebuff حذف می‌شوند.
if [[ -d ".freebuff" ]]; then
    echo
    echo "حذف فایل‌های موقت .freebuff..."
    rm -rf .freebuff
fi

# دریافت اطلاعات جدید از GitHub
echo
echo "دریافت آخرین تغییرات از GitHub..."
git fetch origin

# کامیت تغییرات محلی
if [[ -n "$(git status --porcelain)" ]]; then
    echo
    echo "فایل‌های تغییرکرده:"
    git status --short

    git add -A

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

# همگام‌سازی با GitHub
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
    echo
    echo "همگام‌سازی با origin/$BRANCH..."
    git pull --rebase origin "$BRANCH"
fi

# Push نهایی
echo
echo "در حال Push به GitHub..."
git push -u origin "$BRANCH"

echo
echo "عملیات با موفقیت انجام شد."
