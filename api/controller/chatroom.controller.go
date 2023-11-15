package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"api/model"
	"api/service"
)

type chatRoomData struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	IsMember  bool      `json:"isMember"`
}

func GetAllChatRoom(ctx *gin.Context) {
	userClaims, exists := ctx.Get("claims")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something went wrong",
		})
		return
	}
	claims := userClaims.(*service.Claims)
	chatRooms := []chatRoomData{}
	if err := model.DB.
		Model(&model.ChatRoom{}).
		Select(`chat_rooms.*,
        CASE chat_rooms.id
            WHEN NULL THEN false
            ELSE true
        END AS isMember`).
		Joins("LEFT JOIN user_chat_rooms ON user_chat_rooms.chat_room_id = chat_rooms.id AND user_id = ?", claims.ID).
		Find(&chatRooms).
		Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something went wrong",
			"error":   err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, chatRooms)
}
