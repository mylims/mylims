install:
	npm install
	npm run build
	node ace addons:load
	npm run build

dev: install
	docker-compose up -d ldap
	npm start
