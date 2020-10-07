install:
	npm install
	npm run build

dev: install
	docker-compose up -d
	node reset-dev.mjs
	npm start
