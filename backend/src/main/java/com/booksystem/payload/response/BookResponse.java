package com.booksystem.payload.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String category;
    private String isbn;
    private String description;
    private Integer publishedYear;
    private Integer count;
    private String pdfFilename;
    private LocalDateTime createdAt;
}
