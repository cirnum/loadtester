package app

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/cirnum/strain-hub/app/handler"
	helper "github.com/cirnum/strain-hub/app/helper"

	"github.com/cirnum/strain-hub/config"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var PORT string = ":8080"

type App struct {
	Router   *mux.Router
	Provider config.Provider
}

func Initialize() {
	app := new(App)
	app.Router = mux.NewRouter()
	app.Provider.DB = config.NewConfig()
	app.Provider.Redis = config.InitRedisConfig()
	app.setRouter()
	app.run()
}

func (app *App) run() {

	signalChennal := make(chan os.Signal, 1)
	signal.Notify(signalChennal, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL, os.Interrupt, os.Kill)
	go func() {

		// app.Router.PathPrefix("/").Handler(http.FileServer(rice.MustFindBox("../client/build").HTTPBox()))
		header := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
		methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"})
		origins := handlers.AllowedOrigins([]string{"*"})

		envPort := os.Getenv("PORT")
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

	app.apiHandler("/performancebyurl", "POST", handler.GetPerformanceByUrl, true)
	app.apiHandler("/registration", "POST", handler.Registeration, false)
	app.apiHandler("/login", "POST", handler.Login, false)
	app.apiHandler("/test", "GET", handler.Test, false)
	app.apiHandler("/request", "POST", handler.NewSessionRequest, true)
	app.apiHandler("/request/{id}", "GET", handler.UserRequest, true)
	app.apiHandler("/request", "GET", handler.UserRequest, true)
	app.apiHandler("/performance", "GET", handler.GetPerformance, true)
	app.apiHandler("/server", "POST", handler.CreateServer, true)
	app.apiHandler("/server/{id}", "GET", handler.GetServer, true)
	app.apiHandler("/server", "GET", handler.GetServer, true)
	app.apiHandler("/user", "GET", handler.GetAllUser, true)
	app.apiHandler("/connector", "POST", handler.Connector, false)
	app.apiHandler("/result", "POST", handler.GetServerRespone, false)
	app.Router.PathPrefix("/").Handler(http.StripPrefix("/",
		http.FileServer(http.Dir("./build"))))
}

func (app *App) apiHandler(path string, method string, handler handlerFunction, isAuth bool) {
	if isAuth {
		app.Router.HandleFunc(path, app.withAuthHandler(handler)).Methods(method)
	} else {
		app.Router.HandleFunc(path, app.withoutAuthHandler(handler)).Methods(method)
	}
}

type handlerFunction func(provider config.Provider, w http.ResponseWriter, r *http.Request)

func (app *App) withoutAuthHandler(handler handlerFunction) http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		handler(app.Provider, rw, r)
	}
}

func (app *App) withAuthHandler(handler handlerFunction) http.HandlerFunc {
	return func(rw http.ResponseWriter, r *http.Request) {
		auth, user := helper.AutheticateRequest(r)
		app.Provider.DB.User = user

		if auth {
			handler(app.Provider, rw, r)
		} else {
			rw.WriteHeader(http.StatusUnauthorized)
			rw.Write([]byte("Unauthorized"))
		}
	}
}

var embeddedFiles embed.FS

func getFileSystem() http.FileSystem {

	// Get the build subdirectory as the
	// root directory so that it can be passed
	// to the http.FileServer
	fsys, err := fs.Sub(embeddedFiles, "build")
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}
