package middleware

import (
	"fmt"
	"os"
	"strings"

	"github.com/cirnum/loadtester/server/app/utils"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"

	jwtMiddleware "github.com/gofiber/jwt/v2"
)

// JWTProtected func for specify routes group with JWT authentication.
// See: https://github.com/gofiber/jwt
// func JWTProtected() func(c *fiber.Ctx) error {
// 	// Create config for JWT authentication middleware.
// 	config := jwtMiddleware.Config{
// 		SigningKey:   []byte(os.Getenv("JWT_SECRET_KEY")),
// 		ContextKey:   "jwt", // used in private routes
// 		ErrorHandler: jwtError,
// 	}

//		return jwtMiddleware.New(config)
//	}
func JWTProtected(c *fiber.Ctx) error {
	var tokenString string
	authorization := c.Get("Authorization")

	if strings.HasPrefix(authorization, "Bearer ") {
		tokenString = strings.TrimPrefix(authorization, "Bearer ")
	} else if c.Cookies("token") != "" {
		tokenString = c.Cookies("token")
	}

	if tokenString == "" {
		return utils.ResponseError(c, nil, "You are not logged in", fiber.StatusUnauthorized)
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			message := fmt.Sprintf("Unexpected signing method: %v", token.Header["alg"])
			return nil, fmt.Errorf(message)
		}
		return []byte(os.Getenv("JWT_SECRET_KEY")), nil
	})

	if err != nil {
		return utils.ResponseError(c, nil, fmt.Sprintf("invalidate token: %v", err), fiber.StatusUnauthorized)
	}

	if claim, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		c.Locals("userId", claim["id"].(string))
		c.Locals("email", claim["email"].(string))
		return c.Next()
	}
	return utils.ResponseError(c, nil, "", fiber.StatusInternalServerError)
}

func JWTProtectedClient() func(*fiber.Ctx) error {
	// Create config for JWT authentication middleware.
	config := jwtMiddleware.Config{
		SigningKey:   []byte(os.Getenv("CLIENT_SECRET_KEY")),
		ContextKey:   "jwt", // used in private routes
		ErrorHandler: jwtError,
	}

	return jwtMiddleware.New(config)
}

func jwtError(c *fiber.Ctx, err error) error {
	// Return status 401 and failed authentication error.
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	// Return status 401 and failed authentication error.
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": true,
		"msg":   err.Error(),
	})
}
