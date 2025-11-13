#!/bin/bash
#
# automate_fullstack.sh
# Full automation: Builds all, runs Node.js backend, and serves Python frontend.
#

set -e

#SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
## Assume project root is one level up (parent of 'local_build')
#PROJECT_ROOT=$( dirname "$SCRIPT_DIR" )

#echo "--- Changing to Project Root ($PROJECT_ROOT) ---"
#cd "$PROJECT_ROOT"

echo "===== STAGE 1: BUILDING ALL PROJECTS ====="
./local_build.sh

echo "\n===== STAGE 2: RUNNING SERVERS (Full Stack) ====="

# 1. Run Node.js Backend API server in the background
echo "--- Starting Node.js Backend (API) on http://localhost:3000 ---"
./run_backend.sh &

# 2. Run Python server for Frontend static files in the background
echo "--- Starting Python Server (Frontend) on http://localhost:8080 ---"
python3 serve_static.py 8080 ./app/frontend/dist &

echo "\n--- Both servers are running in the background. ---"
echo "Press 'fg' and then Ctrl+C to stop them, or use 'kill %1 %2'."
wait