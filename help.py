#!/usr/bin/python

import collections
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer

PORT_NUMBER = 8080

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):
	

	def parse_text(self, filename):
		with open(filename, 'r') as f:
			contents = f.read()

		cList = contents.split()

		f.close()

		for c in range(0, len(contents) - 1):
			um = contents[c] + contents[c+1]

			if um == '  ':
				cList.append(um)

		return cList

	def check_ums(self, counter, cList):
		if counter['  '] > (0.10 * len(cList)):
			return "Cut it out with the pauses and the ums\n"
		elif counter['  '] > (0.05 * len(cList)):
			return "Ummm... like You could use um's a bit less\n"
		else:
			return "Nice job with the ums and pauses=\n"

	def check_likes(self, counter, cList):
		if counter['like'] > (0.10 * len(cList)):
			return "Cut it out with the likes"
		elif counter['like'] > (0.05 * len(cList)):
			return "Ummm... like You could use like a bit less"
		else:
			return "Nice job with the likes!"

	def judge(self, cList):
		counter = collections.Counter()
		response = ""

		for c in cList:
			counter[c] += 1
		print counter.most_common()

		response += self.check_ums(counter, cList)
		response += '\n' + self.check_likes(counter, cList)
		return response


	#Handler for the GET requests
	def do_GET(self):
		self.send_response(200)
		self.send_header('Content-type','application/json')
		self.send_header('Access-Control-Allow-Origin','*')
		self.end_headers()
		cList = self.parse_text("log.txt")
		# Send the html message
		# self.wfile.write(self.judge(cList))
		self.wfile.write(self.judge(cList))
		
		return

try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print 'Started httpserver on port ' , PORT_NUMBER
	
	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print '^C received, shutting down the web server'
	server.socket.close()