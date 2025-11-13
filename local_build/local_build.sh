#!/bin/bash
#
# build.sh
# Automates the local build process for the monorepo.
#

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# Assume project root is one level up (parent of 'local_build')
PROJECT_ROOT=$( dirname "$SCRIPT_DIR" )

echo "--- Changing to Project Root ($PROJECT_ROOT) ---"
cd "$PROJECT_ROOT"

echo "--- 1. Installing Monorepo Dependencies ---"
npm install

echo "--- 2. Building 'common-types' Workspace ---"
npm run build -w common-types

echo "--- 3. Building 'backend' Workspace ---"
npm run build -w backend

echo "--- 4. Building 'frontend' Workspace ---"
npm run build -w frontend

echo "--- Build Complete ---"
echo "Backend output: app/backend/dist/"
echo "Frontend output: app/frontend/dist/"