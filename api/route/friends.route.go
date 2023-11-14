package route

import (
	"github.com/gin-gonic/gin"

	"api/controller"
	"api/middleware"
)

func InitFriendsRoute(r *gin.Engine) {
	friendsRoute := r.Group("friends")
	friendsRoute.Use(middleware.Authorize)
	friendsRoute.GET("/", controller.GetAllRelationShip)
	friendsRoute.POST("/:reciever-id", controller.MakeFriendRequest)
	friendsRoute.PATCH("/:sender-id", controller.AcceptFriendRequest)
}
