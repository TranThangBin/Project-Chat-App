package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"api/model"
	"api/service"
)

type messageData struct {
	Author    string    `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	Self      bool      `json:"self"`
}

type sendMessageRequest struct {
	Content string `json:"content" binding:"required"`
}

func GetAllMessage(ctx *gin.Context) {
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
	messages := []messageData{}
	if err := model.DB.
		Model(&model.Message{}).
		Select("CONCAT(first_name, ' ', last_name) AS author, content, messages.created_at, (user_id = ?) AS self", claims.ID).
		InnerJoins("User").
		Where("chat_room_id = ?", chatRoomID).
		Find(&messages).
		Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something gone wrong",
			"error":   err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, messages)
}

func SendMessage(ctx *gin.Context) {
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
	req := sendMessageRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := model.DB.Create(&model.Message{
		UserID:     claims.ID,
		ChatRoomID: uint(chatRoomID),
		Content:    req.Content,
	}).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something gone wrong",
			"error":   err.Error(),
		})
		return
	}
	ctx.Status(http.StatusOK)
}
