test:
	@./node_modules/.bin/mocha --ui tdd --reporter list

categories:
	node lib/categorybuilder.js
	
.PHONY: test 