package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

// ContactForm represents the data sent from the frontend contact form
type ContactForm struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func main() {
	// Serve static files from the "static" directory
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	// API endpoint for contact form
	http.HandleFunc("/api/contact", handleContact)

	port := ":8080"
	fmt.Printf("Server is running on http://localhost%s\n", port)
	fmt.Println("Press Ctrl+C to stop")

	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal("Error starting server: ", err)
	}
}

func handleContact(w http.ResponseWriter, r *http.Request) {
	// Only allow POST requests
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var form ContactForm

	// Decode JSON body
	err := json.NewDecoder(r.Body).Decode(&form)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Log the received message (In a real app, you might save to DB or send email)
	log.Printf("New Contact Message Received:\nName: %s\nEmail: %s\nMessage: %s\n", form.Name, form.Email, form.Message)

	// Save to a file (simple persistence)
	saveMessageToFile(form)

	// Send success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Xabaringiz qabul qilindi!",
	})
}

func saveMessageToFile(form ContactForm) {
	f, err := os.OpenFile("messages.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println("Error opening log file:", err)
		return
	}
	defer f.Close()

	timestamp := time.Now().Format("2006-01-02 15:04:05")
	logEntry := fmt.Sprintf("[%s] Name: %s | Email: %s | Message: %s\n", timestamp, form.Name, form.Email, form.Message)

	if _, err := f.WriteString(logEntry); err != nil {
		log.Println("Error writing to log file:", err)
	}
}
