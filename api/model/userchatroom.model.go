package model

type UserChatRoom struct {
	UserID     uint     `gorm:"primaryKey"`
	ChatRoomID uint     `gorm:"primaryKey"`
	User       User     `gorm:"foreignKey:UserID"`
	ChatRoom   ChatRoom `gorm:"foreignKey:ChatRoomID"`
}
