package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

type CreateRoomRequest struct {
	Token    string `json:"token"`
	RoomName string `json:"room-name"`
}

type SendMessageRequest struct {
	Token   string `json:"token"`
	Content string `json:"content"`
}

type ChatRoomData struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	IsMember  bool      `json:"isMember"`
}

type MessageData struct {
	UserID     uint      `json:"user-id"`
	ChatRoomID uint      `json:"chat-room-id"`
	FirstName  string    `json:"firstname"`
	LastName   string    `json:"lastname"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
}

var chatClients = make(map[*websocket.Conn]uint)

var messageBroadCast = make(chan MessageData)

var chatRoomClients = make(map[*websocket.Conn]bool)

var chatRoomBroadCast = make(chan ChatRoomData)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	http.HandleFunc("/chatroom", handleChatRooms)
	http.HandleFunc("/message", handleMessage)
	go handleNewRoom()
	go handleNewMessage()
	log.Print("Listen and server at ws://localhost:3000")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal("ListenAndServe", err)
	}
}

func handleChatRooms(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	init := r.URL.Query().Get("init-token")
	if init == "" {
		http.Error(w, "Missing init-token query parameter", http.StatusBadRequest)
		return
	}
	chatRooms, err := getAllChatRooms(init)
	if err != nil {
		http.Error(w, "something went wrong", http.StatusInternalServerError)
		return
	}
	chatRoomClients[ws] = true
	for _, chatRoom := range chatRooms {
		ws.WriteJSON(chatRoom)
	}
	for {
		newChatRoomReq := CreateRoomRequest{}
		if err := ws.ReadJSON(&newChatRoomReq); err != nil {
			log.Printf("parsing error error: %v\n", err)
			delete(chatRoomClients, ws)
			break
		}
		chatRoom, err := createNewRoom(newChatRoomReq)
		if err != nil {
			log.Printf("server request error: %v\n", err)
			delete(chatRoomClients, ws)
			break
		}
		chatRoomBroadCast <- chatRoom
	}
}

func handleNewRoom() {
	for {
		chatRoom := <-chatRoomBroadCast
		for client := range chatRoomClients {
			if err := client.WriteJSON(chatRoom); err != nil {
				log.Printf("error %v\n", err)
				client.Close()
				delete(chatRoomClients, client)
			}
		}
	}
}

func handleMessage(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	init := r.URL.Query().Get("init-token")
	if init == "" {
		http.Error(w, "Missing init-token query parameter", http.StatusBadRequest)
		return
	}
	roomID, err := strconv.Atoi(r.URL.Query().Get("room-id"))
	if err != nil {
		http.Error(w, "room-id query parameter is invalid", http.StatusBadRequest)
		return
	}
	messages, err := getAllMessages(init, uint(roomID))
	if err != nil {
		http.Error(w, "something went wrong", http.StatusInternalServerError)
		return
	}
	chatClients[ws] = uint(roomID)
	for _, message := range messages {
		ws.WriteJSON(message)
	}
	for {
		sendMessageReq := SendMessageRequest{}
		if err := ws.ReadJSON(&sendMessageReq); err != nil {
			log.Printf("parsing error error: %v\n", err)
			delete(chatRoomClients, ws)
			break
		}
		message, err := sendMessage(sendMessageReq, uint(roomID))
		if err != nil {
			log.Printf("server request error: %v\n", err)
			delete(chatRoomClients, ws)
			break
		}
		messageBroadCast <- message
	}
}

func handleNewMessage() {
	for {
		message := <-messageBroadCast
		for client := range chatClients {
			if message.ChatRoomID == chatClients[client] {
				if err := client.WriteJSON(message); err != nil {
					log.Printf("error %v\n", err)
					client.Close()
					delete(chatRoomClients, client)
				}
			}
		}
	}
}

func getAllChatRooms(token string) ([]ChatRoomData, error) {
	req, err := http.NewRequest("GET", "http://localhost:8080/chatroom", nil)
	if err != nil {
		return []ChatRoomData{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return []ChatRoomData{}, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return []ChatRoomData{}, err
	}
	chatRoomDatas := []ChatRoomData{}
	err = json.Unmarshal(body, &chatRoomDatas)
	if err != nil {
		return []ChatRoomData{}, err
	}
	return chatRoomDatas, nil
}

func createNewRoom(request CreateRoomRequest) (ChatRoomData, error) {
	data := []byte(fmt.Sprintf(`{"name" : "%s"}`, request.RoomName))
	req, err := http.NewRequest("POST", "http://localhost:8080/chatroom/new", bytes.NewBuffer(data))
	if err != nil {
		return ChatRoomData{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+request.Token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return ChatRoomData{}, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ChatRoomData{}, err
	}
	chatroomData := ChatRoomData{}
	err = json.Unmarshal(body, &chatroomData)
	if err != nil {
		return ChatRoomData{}, err
	}
	return chatroomData, nil
}

func getAllMessages(token string, roomID uint) ([]MessageData, error) {
	url := fmt.Sprintf("http://localhost:8080/chatroom/%d/message", roomID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return []MessageData{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return []MessageData{}, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return []MessageData{}, err
	}
	messages := []MessageData{}
	err = json.Unmarshal(body, &messages)
	if err != nil {
		return []MessageData{}, err
	}
	return messages, nil
}

func sendMessage(request SendMessageRequest, roomID uint) (MessageData, error) {
	url := fmt.Sprintf("http://localhost:8080/chatroom/%d/message/new", roomID)
	data := []byte(fmt.Sprintf(`{"content" : "%s"}`, request.Content))
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		return MessageData{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+request.Token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return MessageData{}, err
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return MessageData{}, err
	}
	message := MessageData{}
	err = json.Unmarshal(body, &message)
	if err != nil {
		return MessageData{}, err
	}
	return message, nil
}
