import http.server
import socketserver
import os
import sys

try:
	PORT = int(sys.argv[1])
except IndexError:
	PORT = 8000

try:
	SERVE_DIR = sys.argv[2]
except IndexError:
	SERVE_DIR = "."

try:
	os.chdir(SERVE_DIR)
except FileNotFoundError:
	print(f"Error: Directory '{SERVE_DIR}' does not exist.")
	sys.exit(1)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
	print(f"Serving static files from '{SERVE_DIR}' at http://localhost:{PORT}")
	
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		print("\nShutting down server.")
		httpd.shutdown()