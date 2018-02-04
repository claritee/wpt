.PHONY: start stop destroy help

provision:
	@docker-compose pull

start:
	@echo Start wpt containers up
	@docker-compose up -d

stop:
	@echo Stopping wpt instances
	@docker-compose stop

destroy:
	@echo Destroying wpt instances
	@docker-compose rm -vfs

help:
	@echo  'Targets:'
	@echo  '  start             - Start server and agent'
	@echo  '  stop              - Stop server and agent'
	@echo  '  destroy           - Destroy server and agent'
	@echo  '  help              - Print this help'
	@echo  ''