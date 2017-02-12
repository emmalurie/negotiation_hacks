#!/usr/bin/python
# -*- coding: utf-8 -*-

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
			return "Using the word 'um' over and over is detracting from your message.\n"
		elif counter['  '] > (0.05 * len(cList)):
			return "It seems like you are using several filler words. We suggest taking a deep breath instead of saying a word like 'um'.\n"
		else:
			return "You did a great job speaking fluently and clearly\n"

	def check_likes(self, counter, cList):
		if counter['like'] > (0.10 * len(cList)):
			return "Using the word 'like' is making your pitch weaker."
		elif counter['like'] > (0.05 * len(cList)):
			return "We suggest you use the word 'like' less frequently."
		else:
			return "Nice job avoiding using the common filler word 'like'!"

	def check_profanity(self, cList):
		profanity = ["shit", "fuck", "fucking","damn", "bitch", "tits", "screwed", "hell", "piss", "bastard", "shut up", "stupid", "ass"]
		for elem in cList:
			if elem in profanity:
				return "Please refrain from using profanity while negotiating."
		return "Your language is appropriate for this conversation."

	def check_threat(self, cList):
		threat =  ['leave', 'quit', 'abandon']
		for elem in cList:
			if elem in threat:
				return "We advise that you are more positive in your conversation instead of threatening to quit."
							
		return "Good job in staying positive!"

	def check_fam(self, cList):
		num = 0
		fam = ["family", "kids", "kid", "child", "children", "husband", "mom", "mother"]
		for elem in fam:
			if elem in cList:
				num += 1
		if num >= 0.05 * len(cList):
			return "Family is important, but we want to hear about your achievements and goals!"
		else:
			return "You sound very self-motivated and confident!"

	def judge(self, cList):
		counter = collections.Counter()
		response = ""

		for c in cList:
			counter[c] += 1
		print counter.most_common()

		response += self.check_ums(counter, cList)
		response += '\n' + self.check_likes(counter, cList)
		response += '\n' + self.check_profanity(cList)
		response += '\n' + self.check_threat(cList)
		response += '\n' + self.check_fam(cList)

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