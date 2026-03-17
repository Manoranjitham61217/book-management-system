package com.booksystem.controller;

import com.booksystem.entity.Book;
import com.booksystem.service.GutenbergService;
import com.booksystem.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gutenberg")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GutenbergController {

    @Autowired
    private GutenbergService gutenbergService;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/search")
    public ResponseEntity<List<Book>> search(@RequestParam String query) {
        return ResponseEntity.ok(gutenbergService.searchArchives(query));
    }

    @PostMapping("/import")
    public ResponseEntity<?> importBook(@RequestBody Book book) {
        if (bookRepository.findByIsbn(book.getIsbn()).isPresent()) {
            return ResponseEntity.badRequest().body("This essence already exists in the local archives.");
        }
        return ResponseEntity.ok(bookRepository.save(book));
    }
}
