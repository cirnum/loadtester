package app

import (
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/cirnum/strain-hub/server/cli/config"
	"github.com/cirnum/strain-hub/server/cli/handler"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var PORT string = ":8080"

type App struct {
	Router *mux.Router
	config *config.Config
}

func Initialize(config *config.Config) {
	app := new(App)
	app.config = config
	app.Router = mux.NewRouter()
	app.setRouter()
	app.run()
}

func (app *App) run() {

	signalChennal := make(chan os.Signal, 1)
	signal.Notify(signalChennal, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL, os.Interrupt, os.Kill)
	go func() {

		header := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
		methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"})
		origins := handlers.AllowedOrigins([]string{"*"})

		envPort := app.config.Port
		if envPort != "" {
			PORT = fmt.Sprintf(":%s", envPort)
		}
		PORT = fmt.Sprintf(":%s", envPort)
		fmt.Printf("Running on %s", PORT)

		err := http.ListenAndServe(PORT, handlers.CORS(header, methods, origins)(app.Router))
		if err != nil {
			panic("Something Went wrong" + err.Error())
		}

	}()
	sig := <-signalChennal
	fmt.Println("Signal recieved", sig)
}

func (app *App) setRouter() {

	app.apiHandler("/request", "POST", handler.RunRequest, true)
	app.apiHandler("/ping", "GET", handler.Ping, false)
}

func (app *App) apiHandler(path string, method string, handler handlerFunction, isAuth bool) {
	if isAuth {
		app.Router.HandleFunc(path, app.withAuthHandler(handler)).Methods(method)
	} else {
		app.Router.HandleFunc(path, app.withoutAuthHandler(handler)).Methods(method)
	}
}

type handlerFunction func(config *config.Config, rw http.ResponseWriter, r *http.Request)

func (app *App) withoutAuthHandler(handler handlerFunction) http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		handler(app.config, rw, r)
	}
}

func (app *App) withAuthHandler(handler handlerFunction) http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		auth := app.config.Token

		if auth != "" {
			handler(app.config, rw, r)
		} else {
			rw.WriteHeader(http.StatusUnauthorized)
			rw.Write([]byte("Unauthorized"))
		}
	}
}
