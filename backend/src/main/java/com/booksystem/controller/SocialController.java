package com.booksystem.controller;

import com.booksystem.payload.response.SocialActivity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class SocialController {

    @MessageMapping("/pulse")
    @SendTo("/topic/pulse")
    public SocialActivity broadcastActivity(SocialActivity activity) {
        activity.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        return activity;
    }
}
