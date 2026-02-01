#!/bin/bash

# Run review for all courses

set -e

echo "🔍 Running reviews for all courses..."
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Review Course 1
echo "📚 Reviewing React Fundamentals..."
cd "$ROOT_DIR/courses/01-react-fundamentals/project"
npm run review || echo "⚠️  Review failed (may need dependencies installed)"

# Review Course 2
echo ""
echo "📚 Reviewing RTK Query..."
cd "$ROOT_DIR/courses/02-redux-rtk-query/project"
npm run review || echo "⚠️  Review failed (may need dependencies installed)"

# Review Course 3
echo ""
echo "📚 Reviewing Next.js App Router..."
cd "$ROOT_DIR/courses/03-nextjs-app-router/project"
npm run review || echo "⚠️  Review failed (may need dependencies installed)"

# Global review
echo ""
echo "🌐 Running global review..."
cd "$ROOT_DIR"
node global-review/run-all-reviews.js || echo "⚠️  Global review failed"

echo ""
echo "✅ Review process complete!"
