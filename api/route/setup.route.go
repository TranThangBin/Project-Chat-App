package route

import (
	"github.com/gin-gonic/gin"
)

func InitRoutes(r *gin.Engine) {
	initAuthRoute(r)
	initFriendRoute(r)
	initChatRoomRoute(r)
}
