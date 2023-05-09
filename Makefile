DEFAULT_VERSION=1.0.0-local
VERSION := $(or $(VERSION),$(DEFAULT_VERSION))

clean:
	@echo "Cleaning..."
	rm -rf ./strain-ui/dist
	rm -rf ./build
build: ui/build build/server
build/server:
	cd server && go build -ldflags "-w -X main.VERSION=$(VERSION)" -o '../build/server'
ui/build:
	@echo "Building UI..."
	cd strain-ui && npm run build && mkdir dist &&cp -r dist ../build/
ui/node_module:
	@echo "Installing node modules..."
	cd strain-ui && npm install
build-go:
	cd server && go build main.go
run: _ui/build
	@echo "Running..."
	go run ./server/main.go
