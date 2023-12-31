package route

import (
	"github.com/gin-gonic/gin"

	"api/controller"
)

func initAuthRoute(r *gin.Engine) {
	authRoute := r.Group("/auth")
	authRoute.POST("/register", controller.Register)
	authRoute.POST("/login", controller.Login)
	authRoute.POST("/refresh", controller.Refresh)
	authRoute.GET("/profile", controller.Profile)
}
