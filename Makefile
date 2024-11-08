
.PHONY: test deploy install clean


test:
	tsc
	node memoir.test.js


deploy: test
	mkdir -p ~/my-work/www-mv/xpmatteo.github.io/static/memoir
	cp index.html memoir.js ~/my-work/www-mv/xpmatteo.github.io/static/memoir
	bash -c "cd ~/my-work/www-mv/xpmatteo.github.io/ && git add static/memoir && git commit -m 'Updated memoir helper' && git push"


install:
	npm install

clean:
	rm -rf *.js tsconfig.tsbuildinfo node_modules
