package route

import (
	"github.com/gin-gonic/gin"

	"api/controller"
	"api/middleware"
)

func initChatRoomRoute(r *gin.Engine) {
	chatRoomRoute := r.Group("chatroom")
	chatRoomRoute.Use(middleware.Authorize)
	chatRoomRoute.GET("", controller.GetAllChatRoom)
	chatRoomRoute.POST("/new", controller.CreateChatRoom)
	chatRoomRoute.POST("/join/:chat-room-id", controller.JoinChatRoom)

	messageRoute := chatRoomRoute.Group(":chat-room-id/message")
	messageRoute.GET("", controller.GetAllMessage)
	messageRoute.POST("/new", controller.SendMessage)
}
