package com.booksystem.service;

import com.booksystem.entity.Book;
import com.booksystem.payload.request.BookRequest;
import com.booksystem.payload.response.BookResponse;
import com.booksystem.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Page<BookResponse> getAllBooks(String query, Pageable pageable) {
        Page<Book> books;
        if (query != null && !query.isEmpty()) {
            books = bookRepository.searchBooks(query, pageable);
        } else {
            books = bookRepository.findAll(pageable);
        }
        return books.map(this::mapToResponse);
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return mapToResponse(book);
    }

    @Transactional
    public BookResponse createBook(BookRequest bookRequest) {
        Book book = Book.builder()
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .category(bookRequest.getCategory())
                .isbn(bookRequest.getIsbn())
                .description(bookRequest.getDescription())
                .publishedYear(bookRequest.getPublishedYear())
                .count(bookRequest.getCount() != null ? bookRequest.getCount() : 1)
                .build();

        return mapToResponse(bookRepository.save(book));
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest bookRequest) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        book.setTitle(bookRequest.getTitle());
        book.setAuthor(bookRequest.getAuthor());
        book.setCategory(bookRequest.getCategory());
        book.setIsbn(bookRequest.getIsbn());
        book.setDescription(bookRequest.getDescription());
        book.setPublishedYear(bookRequest.getPublishedYear());
        book.setCount(bookRequest.getCount());

        return mapToResponse(bookRepository.save(book));
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    @Transactional
    public void uploadBookPdf(Long id, MultipartFile file) throws IOException {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        String uploadDir = "uploads/pdfs/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new RuntimeException("Original file name is empty");
        }
        String filename = id + "_" + originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        book.setPdfFilename(filename);
        bookRepository.save(book);
    }

    private BookResponse mapToResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .category(book.getCategory())
                .isbn(book.getIsbn())
                .description(book.getDescription())
                .publishedYear(book.getPublishedYear())
                .count(book.getCount())
                .pdfFilename(book.getPdfFilename())
                .createdAt(book.getCreatedAt())
                .build();
    }
}
