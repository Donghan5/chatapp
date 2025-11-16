#!/bin/bash
#
# automate_python.sh
# Full automation: Builds all apps and SERVES the frontend build directory.
#

set -e

#echo "--- Starting Node.js Backend (API) on http://localhost:3000 ---"
#./run_backend.sh &

#echo "--- Starting Python Server (Frontend) on http://localhost:8080 ---"
#python3 serve_static.py 8080 ../app/frontend/dist &

echo "\n--- Both servers are running in the background. ---"
echo "Press 'fg' and then Ctrl+C to stop them, or use 'kill %1 %2'."
wait