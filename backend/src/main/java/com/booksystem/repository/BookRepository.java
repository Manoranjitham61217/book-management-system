package com.booksystem.repository;

import com.booksystem.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);

    Page<Book> findByCategoryContainingIgnoreCase(String category, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE " +
            "LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Book> searchBooks(@Param("query") String query, Pageable pageable);

    java.util.Optional<Book> findByIsbn(String isbn);
}
