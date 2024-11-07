
.PHONY: test
test:
	tsc
	node memoir.test.js


deploy:
	tsc
	mkdir -p ~/my-work/www-mv/xpmatteo.github.io/static/memoir
	cp index.html memoir.js ~/my-work/www-mv/xpmatteo.github.io/static/memoir
	bash -c "cd ~/my-work/www-mv/xpmatteo.github.io/ && git add static/memoir && git commit -m 'Updated memoir helper' && git push"
