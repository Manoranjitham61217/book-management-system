package com.booksystem.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;

@Service
public class AiService {

    private final String[] patterns = {
            "A profound exploration of %s within a complex narrative structure.",
            "The author masterfully weaves themes of %s into the protagonist's journey.",
            "A compelling look at how %s shapes the world of the characters.",
            "An innovative take on the %s genre, offering fresh perspectives."
    };

    private final String[] themes = { "resilience", "technological ethics", "human connection", "existential wonder",
            "societal evolution" };

    public Map<String, String> getBookInsights(String title, String author) {
        Random random = new Random(title.hashCode() + author.hashCode());
        String theme = themes[random.nextInt(themes.length)];
        String pattern = patterns[random.nextInt(patterns.length)];

        String summary = String.format(pattern, theme);
        String sentiment = random.nextBoolean() ? "Enlightening" : "Thought-provoking";
        String recommendation = "Best enjoyed in a quiet space with room for reflection.";

        return Map.of(
                "summary", summary,
                "sentiment", sentiment,
                "recommendation", recommendation,
                "score", String.valueOf(85 + random.nextInt(15)));
    }
}
