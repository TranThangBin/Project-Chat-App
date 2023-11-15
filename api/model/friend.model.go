package model

import (
	"time"
)

type Friend struct {
	UserID    uint `gorm:"primaryKey"`
	FriendID  uint `gorm:"primaryKey"`
	Status    uint `gorm:"type:tinyint"`
	CreatedAt time.Time
	UpdatedAt time.Time
	User      User `gorm:"foreignKey:UserID"`
	Friend    User `gorm:"foreignKey:FriendID"`
}
