# build the React App
FROM node:alpine AS node_builder
ADD . /app
WORKDIR /app/ui
RUN npm install --force
RUN npm run build

# build the Go API
FROM golang:latest AS builder
COPY --from=node_builder /app /app
COPY --from=node_builder /app/ui/dist /app/server/dist
WORKDIR /app/server
RUN go mod download
RUN go get -u github.com/pressly/goose/cmd/goose
RUN go install github.com/GeertJohan/go.rice/rice@latest
RUN rice embed-go
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

# copy the build assets to a minimal
# alpine image
FROM alpine:latest 
RUN apk --no-cache add ca-certificates
COPY --from=builder /main . 
COPY --from=builder /app/server/.env.example .env
RUN chmod +x ./main
EXPOSE 3005
ENV MASTER_IP ""
ENV WORKER false
ENV HOST_URL ""
CMD ./main --WORKER=$WORKER --MASTER_IP=$MASTER_IP --HOST_URL=$HOST_URL