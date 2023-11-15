package route

import (
	"github.com/gin-gonic/gin"

	"api/controller"
	"api/middleware"
)

func InitFriendRoute(r *gin.Engine) {
	friendRoute := r.Group("friend")
	friendRoute.Use(middleware.Authorize)
	friendRoute.GET("", controller.GetAllRelationShip)
	friendRoute.POST("/:reciever-id", controller.MakeFriendRequest)
	friendRoute.PATCH("/:sender-id", controller.AcceptFriendRequest)
	friendRoute.DELETE("/:friend-id", controller.RemoveFriend)
}
