package com.example.demo.websocket;
import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;
import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.security.Principal;
import java.util.Objects;
import java.util.Optional;


@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private SimpUserRegistry simpUserRegistry;
    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        Principal principal=event.getUser();
        assert principal != null;
        Optional<User> user=userRepository.findByEmail(principal.getName(),0);
       if(user.isPresent()){
           for (UserRepository.SocketConnectedDetails element : userRepository.findFriends(user.get().getId())) {
             if(simpUserRegistry.getUser(element.getUsername())!=null){
                 String onlineFriend= Objects.requireNonNull(simpUserRegistry.getUser(element.getUsername())).getName();
                 ConnectedMessage connectedMessage=new ConnectedMessage();
                 connectedMessage.setId(element.getId());
                 connectedMessage.setType("CONNECTED");
                 simpMessagingTemplate.convertAndSendToUser(onlineFriend,"/queue/online",connectedMessage);
             }
           }
       }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        Principal principal=event.getUser();
        assert principal != null;
        Optional<User> user=userRepository.findByEmail(principal.getName(),0);
        if(user.isPresent()){
            for (UserRepository.SocketConnectedDetails element : userRepository.findFriends(user.get().getId())) {
                if(simpUserRegistry.getUser(element.getUsername())!=null){
                    String onlineFriend= Objects.requireNonNull(simpUserRegistry.getUser(element.getUsername())).getName();
                    ConnectedMessage connectedMessage=new ConnectedMessage();
                    connectedMessage.setId(element.getId());
                    connectedMessage.setType("DISCONNECTED");
                    simpMessagingTemplate.convertAndSendToUser(onlineFriend,"/queue/online",connectedMessage);
                }
            }
        }
    }


        @Getter
        @Setter
        private class ConnectedMessage{
        Long id;
        String type;
        }
    }

