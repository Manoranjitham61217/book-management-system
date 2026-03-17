package com.booksystem.controller;

import com.booksystem.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiController {

    @Autowired
    private AiService aiService;

    @GetMapping("/insights")
    public ResponseEntity<?> getInsights(@RequestParam String title, @RequestParam String author) {
        Map<String, String> insights = aiService.getBookInsights(title, author);
        return ResponseEntity.ok(insights);
    }
}
