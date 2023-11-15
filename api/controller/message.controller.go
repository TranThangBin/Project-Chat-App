package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"api/model"
	"api/service"
)

type messageData struct {
	UserID     uint      `json:"user-id"`
	ChatRoomID uint      `json:"chat-room-id"`
	FirstName  string    `json:"firstname"`
	LastName   string    `json:"lastname"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
}

type sendMessageRequest struct {
	Content string `json:"content" binding:"required"`
}

func GetAllMessage(ctx *gin.Context) {
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
		Select("user_id, chat_room_id, first_name, last_name, content, messages.created_at").
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
	message := model.Message{
		UserID:     claims.ID,
		ChatRoomID: uint(chatRoomID),
		Content:    req.Content,
	}
	if err := model.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&message).Error; err != nil {
			return err
		}
		if err := tx.Preload("User").First(&message, message.ID).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "something gone wrong",
			"error":   err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, messageData{
		UserID:     message.UserID,
		ChatRoomID: message.ChatRoomID,
		FirstName:  message.User.FirstName,
		LastName:   message.User.LastName,
		Content:    message.Content,
		CreatedAt:  message.CreatedAt,
	})
}
