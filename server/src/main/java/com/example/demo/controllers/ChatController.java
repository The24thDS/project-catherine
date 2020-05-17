package com.example.demo.controllers;
import com.example.demo.models.chatmodels.ChatMessage;
import com.example.demo.models.chatmodels.MessageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;
    @MessageMapping("/chat")
    public void sendMessage(@Payload MessageModel message, SimpMessageHeaderAccessor headerAccessor) {
        ChatMessage chatMessage=new ChatMessage();
        chatMessage.setMessage(message.getMessage());
        chatMessage.setSender(headerAccessor.getUser().getName());
        //persistence to be done
        simpMessagingTemplate.convertAndSendToUser(message.getToUser(),"/queue/chat",chatMessage);
    }



}
