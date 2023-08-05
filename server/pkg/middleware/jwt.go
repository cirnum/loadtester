package middleware

import (
	"fmt"
	"strings"

	"github.com/cirnum/loadtester/server/app/utils"
	"github.com/cirnum/loadtester/server/pkg/configs"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
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

type UserInfo struct {
	userId string
	email  *string
}

func JWTProtectedForOAUTH(c *fiber.Ctx, tokenString string) (UserInfo, error) {
	userInfo := UserInfo{}
	var err error

	if configs.ConfigProvider.AuthClient != nil {
		sessClaims, err := configs.ConfigProvider.AuthClient.VerifyToken(tokenString)

		if err != nil {
			return userInfo, err
		}
		user, err := configs.ConfigProvider.AuthClient.Users().Read(sessClaims.Claims.Subject)
		if err != nil {
			return userInfo, err
		}
		userInfo.userId = user.ID
		userInfo.email = user.PrimaryEmailAddressID
	}
	return userInfo, err
}

func JWTProtected(c *fiber.Ctx) error {

	var tokenString string
	authorization := c.Get("Authorization")
	if c.Cookies("__session") != "" {
		tokenString = c.Cookies("__session")
	} else if strings.HasPrefix(authorization, "Bearer ") {
		tokenString = strings.TrimPrefix(authorization, "Bearer ")
	}

	if tokenString == "" {
		return utils.ResponseError(c, nil, "You are not logged in", fiber.StatusUnauthorized)
	}

	userInfo, err := JWTProtectedForOAUTH(c, tokenString)

	if err != nil {
		return utils.ResponseError(c, nil, fmt.Sprintf("Invalidate token: %v", err), fiber.StatusUnauthorized)
	}

	if userInfo.userId != "" {
		c.Locals("userId", userInfo.userId)
		c.Locals("email", userInfo.email)
		return c.Next()
	}

	return utils.ResponseError(c, err, "", fiber.StatusInternalServerError)
}

// func JWTProtectedClient() func(*fiber.Ctx) error {
// 	// Create config for JWT authentication middleware.
// 	config := jwtMiddleware.Config{
// 		SigningKey:   []byte(os.Getenv("CLIENT_SECRET_KEY")),
// 		ContextKey:   "jwt", // used in private routes
// 		ErrorHandler: jwtError,
// 	}

// 	return jwtMiddleware.New(config)
// }

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
