#!/bin/bash
#
# run_backend.sh
# Runs the compiled Node.js backend server.
#

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# Assume project root is one level up (parent of 'local_build')
PROJECT_ROOT=$( dirname "$SCRIPT_DIR" )

echo "--- Changing to Project Root ($PROJECT_ROOT) ---"
cd "$PROJECT_ROOT"

echo "--- Starting Node.js Backend Server ---"
echo "Access your API at http://localhost:3000 (or as configured)"

# Execute the main JS file produced by the build
node app/backend/dist/index.js