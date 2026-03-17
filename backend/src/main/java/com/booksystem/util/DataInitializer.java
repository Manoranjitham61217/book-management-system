package com.booksystem.util;

import com.booksystem.entity.Book;
import com.booksystem.entity.Role;
import com.booksystem.entity.User;
import com.booksystem.repository.BookRepository;
import com.booksystem.repository.UserRepository;
import com.booksystem.service.GutenbergService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private BookRepository bookRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder encoder;

        @Autowired
        private GutenbergService gutenbergService;

        @Override
        public void run(String... args) throws Exception {
                // Seed Admin User if not exists
                if (!userRepository.findByUsername("admin").isPresent()) {
                        User admin = User.builder()
                                        .username("admin")
                                        .email("admin@booksystem.com")
                                        .password(encoder.encode("admin123"))
                                        .role(Role.ROLE_ADMIN)
                                        .build();
                        userRepository.save(admin);
                        System.out.println("Lumina Admin initialized: admin / admin123");
                }

                // Seed Books if table is empty
                if (bookRepository.count() == 0) {
                        System.out.println("Fetching celestial archives from Project Gutenberg...");
                        try {
                                List<Book> classics = gutenbergService.getTopClassics().stream().limit(10).toList();
                                if (!classics.isEmpty()) {
                                        bookRepository.saveAll(classics);
                                        System.out.println(
                                                        "Library seeded with 10 global classics from Project Gutenberg.");
                                } else {
                                        throw new Exception("Empty result from Gutenberg");
                                }
                        } catch (Exception e) {
                                System.out.println(
                                                "Gutenberg archive momentarily unreachable. Seeding with local scrolls...");
                                Book[] sampleBooks = {
                                                Book.builder().title("The Great Gatsby").author("F. Scott Fitzgerald")
                                                                .category("Classic")
                                                                .isbn("9780743273565")
                                                                .description("A story of ambition and love in the Roaring Twenties.")
                                                                .publishedYear(1925).count(5).build(),
                                                Book.builder().title("1984").author("George Orwell")
                                                                .category("Dystopian").isbn("9780451524935")
                                                                .description("A chilling look at a futuristic totalitarian state.")
                                                                .publishedYear(1949)
                                                                .count(3).build(),
                                                Book.builder().title("The Hobbit").author("J.R.R. Tolkien")
                                                                .category("Fantasy")
                                                                .isbn("9780547928227")
                                                                .description("The adventure of Bilbo Baggins in Middle-earth.")
                                                                .publishedYear(1937).count(8).build(),
                                                Book.builder().title("The Alchemist").author("Paulo Coelho")
                                                                .category("Philosophy")
                                                                .isbn("9780062315007")
                                                                .description("A fable about following your dream.")
                                                                .publishedYear(1988).count(12).build()
                                };
                                bookRepository.saveAll(Arrays.asList(sampleBooks));
                        }
                }
        }
}
