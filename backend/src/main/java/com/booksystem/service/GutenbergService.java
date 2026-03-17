package com.booksystem.service;

import com.booksystem.entity.Book;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GutenbergService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String GUTENDEX_API = "https://gutendex.com/books/";

    public List<Book> searchArchives(String query) {
        String url = GUTENDEX_API + "?search=" + query;
        return fetchFromUrl(url);
    }

    public List<Book> getTopClassics() {
        return fetchFromUrl(GUTENDEX_API);
    }

    private List<Book> fetchFromUrl(String url) {
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        if (response == null || !response.containsKey("results")) {
            return new ArrayList<>();
        }

        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        return results.stream().map(this::mapToBook).collect(Collectors.toList());
    }

    private Book mapToBook(Map<String, Object> result) {
        List<Map<String, String>> authors = (List<Map<String, String>>) result.get("authors");
        String authorName = authors.isEmpty() ? "Unknown" : authors.get(0).get("name");

        List<String> subjects = (List<String>) result.get("subjects");
        String category = subjects.isEmpty() ? "Classic" : subjects.get(0);
        if (category.length() > 50)
            category = category.substring(0, 47) + "...";

        return Book.builder()
                .title((String) result.get("title"))
                .author(authorName)
                .category(category)
                .isbn("PG-" + result.get("id")) // Project Gutenberg doesn't have ISBN, using ID prefix
                .description("A classic work from the Project Gutenberg collection. Subjects: "
                        + String.join(", ", subjects))
                .publishedYear(0) // Gutendex doesn't provide precise published year directly in simple results
                .count(10)
                .build();
    }
}
