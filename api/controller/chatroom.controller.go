package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"api/model"
	"api/service"
)

type createChatRoomRequest struct {
	Name string `json:"name" binding:"required"`
}

type chatRoomData struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
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
		Select("chat_rooms.*, (user_id IS NOT NULL) AS is_member").
		Joins("LEFT JOIN user_chat_rooms ON chat_room_id = id AND user_id = ?", claims.ID).
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

func CreateChatRoom(ctx *gin.Context) {
	req := createChatRoomRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	chatRoom := model.ChatRoom{Name: req.Name}
	if err := model.DB.Create(&chatRoom).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something went wrong",
			"error":   err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, chatRoomData{
		ID:        chatRoom.ID,
		Name:      chatRoom.Name,
		CreatedAt: chatRoom.CreatedAt,
		IsMember:  false,
	})
}

func JoinChatRoom(ctx *gin.Context) {
	userClaims, exists := ctx.Get("claims")
	if !exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something went wrong",
		})
		return
	}
	claims := userClaims.(*service.Claims)
	chatRoomID, err := strconv.Atoi(ctx.Param("chat-room-id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if err := model.DB.Create(&model.UserChatRoom{
		UserID:     claims.ID,
		ChatRoomID: uint(chatRoomID),
	}).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something gone wrong",
			"error":   err.Error(),
		})
		return
	}
	ctx.Status(http.StatusOK)
}
