package model

import (
	"time"
)

type UserChatRoom struct {
	UserID     uint `gorm:"primaryKey"`
	ChatRoomID uint `gorm:"primaryKey"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	User       User     `gorm:"foreignKey:UserID"`
	ChatRoom   ChatRoom `gorm:"foreignKey:ChatRoomID"`
}
