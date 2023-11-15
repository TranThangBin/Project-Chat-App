package model

import (
	"time"
)

type ChatRoom struct {
	ID           uint   `gorm:"primaryKey"`
	Name         string `gorm:"type:varchar(50)"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	UserChatRoom []UserChatRoom `gorm:"foreignKey:ChatRoomID"`
}
