package model

import (
	"time"
)

type Message struct {
	ID         uint   `gorm:"primaryKey"`
	UserID     uint   `gorm:"primaryKey"`
	ChatRoomID uint   `gorm:"primaryKey"`
	Content    string `gorm:"type:nvarchar(255)"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	User       User     `gorm:"foreignKey:UserID"`
	ChatRoom   ChatRoom `gorm:"foreignKey:ChatRoomID"`
}
