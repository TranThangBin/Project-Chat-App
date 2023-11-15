package route

import (
	"github.com/gin-gonic/gin"

	"api/controller"
	"api/middleware"
)

func InitChatRoomRoute(r *gin.Engine) {
	chatRoomRoute := r.Group("chatroom")
	chatRoomRoute.Use(middleware.Authorize)
	chatRoomRoute.GET("", controller.GetAllChatRoom)
}
