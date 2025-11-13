#!/bin/bash
#
# automate_python.sh
# Full automation: Builds all apps and SERVES the frontend build directory.
#

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# Assume project root is one level up (parent of 'local_build')
PROJECT_ROOT=$( dirname "$SCRIPT_DIR" )

echo "--- Changing to Project Root ($PROJECT_ROOT) ---"
cd "$PROJECT_ROOT"

echo "===== STAGE 1: BUILDING ALL PROJECTS ====="
./build.sh

echo "\n===== STAGE 2: SERVING STATIC FRONTEND FILES WITH PYTHON ====="
# This serves the *frontend's build output* directory on port 8080
python3 serve_static.py 8080 ./app/frontend/dist