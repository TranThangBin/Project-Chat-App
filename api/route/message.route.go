package route

import (
	"github.com/gin-gonic/gin"
)

func initMessageRoute(r *gin.RouterGroup) *gin.RouterGroup {
	messageRoute := r.Group("message/:chat-room-id")
	messageRoute.GET("")
	messageRoute.POST("/new")
	return messageRoute
}
