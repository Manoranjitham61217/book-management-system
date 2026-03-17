package com.booksystem.controller;

import com.booksystem.payload.request.BookRequest;
import com.booksystem.payload.response.BookResponse;
import com.booksystem.payload.response.MessageResponse;
import com.booksystem.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<Page<BookResponse>> getAllBooks(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        String sortField = sort[0];
        Sort.Direction direction = sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return ResponseEntity.ok(bookService.getAllBooks(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest bookRequest) {
        return ResponseEntity.ok(bookService.createBook(bookRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest bookRequest) {
        return ResponseEntity.ok(bookService.updateBook(id, bookRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(new MessageResponse("Book deleted successfully!"));
    }

    @PostMapping("/{id}/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> uploadPdf(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            bookService.uploadBookPdf(id, file);
            return ResponseEntity.ok(new MessageResponse("PDF uploaded successfully!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to upload PDF: " + e.getMessage()));
        }
    }

    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/pdfs/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
