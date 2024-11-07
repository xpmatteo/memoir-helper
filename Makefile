
.PHONY: test
test: memoir.js memoir.test.js
	node memoir.test.js

memoir.js: memoir.ts
	tsc memoir.ts

memoir.test.js: memoir.test.ts
	tsc memoir.test.ts

