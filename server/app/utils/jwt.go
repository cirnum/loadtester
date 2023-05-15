package utils

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/cirnum/strain-hub/server/db/models"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

const (
	GetHashMethod            string = "GetHash"
	GenerateJWTMethod        string = "GenerateJWT"
	AutheticateRequestMethod string = "AutheticateRequest"
)
const (
	ErrorWhileRetrivingHash string = "Error while retrive hash"
	ErrorGenJwt             string = "Error while Generate jwt"
)

func GetHash(pwd []byte) (string, error) {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func GenerateJWT(user models.User) (string, error) {
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["email"] = user.Email
	atClaims["id"] = user.ID
	atClaims["exp"] = time.Now().Add(time.Minute * 7200).Unix()

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("JWT_SECRET_KEY")))
	if err != nil {
		return "", err
	}
	return token, nil
}

func GenerateTokenKey(server models.Server) (string, error) {
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["id"] = server.ID
	atClaims["user"] = server.UserID

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("CLIENT_SECRET_KEY")))
	if err != nil {
		return "", err
	}
	return token, nil
}
func AutheticateRequest(r *http.Request) (bool, models.User) {
	var user models.User
	jwtToken := r.Header.Get("Authorization")
	if jwtToken == "" {
		return false, user
	}
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			message := fmt.Sprintf("Unexpected signing method: %v", token.Header["alg"])
			return nil, fmt.Errorf(message)
		}
		return []byte(os.Getenv("JWT_SECRET_KEY")), nil
	})

	if err != nil {
		return false, user
	}

	if claim, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		user.Email = claim["email"].(string)
		user.ID, _ = claim["id"].(string)
		if claim["name"] != nil {
			user.Name = claim["name"].(string)
		}

		return true, user
	}
	return false, user

}
