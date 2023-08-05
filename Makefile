DEFAULT_VERSION=1.0.0-local
VERSION := $(or $(VERSION),$(DEFAULT_VERSION))

clean:
	@echo "Cleaning..."
	rm -rf ./ui/dist
	rm -rf ./build
build: ui/build build/server
build/server:
	# cd server && go build -ldflags "-w -X main.VERSION=$(VERSION)" -o '../build/server'
	cd server && rice embed-go && gox \
		-osarch="linux/amd64 linux/arm64 darwin/amd64 darwin/arm64 windows/amd64" \
		-ldflags "-w -X main.VERSION=$(VERSION)" \
		-output="../build/{{.OS}}/{{.Arch}}/server" \
		./...
ui/build:
	@echo "Building UI..."
	cd ui && npm i --force && npm run build && cp -r dist ../server/
ui/node_module:
	@echo "Installing node modules..."
	cd ui && npm install
build-go:
	cd server && go build main.go
rg: 
	@echo "Running... backend server"
	cd server && go run main.go
rf: 
	@echo "Running.. frontend client"
	cd ui && npm run dev
