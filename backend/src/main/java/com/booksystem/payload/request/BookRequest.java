package com.booksystem.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookRequest {
    @NotBlank
    @Size(min = 1, max = 255)
    private String title;

    @NotBlank
    @Size(min = 1, max = 255)
    private String author;

    private String category;

    private String isbn;

    private String description;

    @Min(1000)
    @Max(2100)
    private Integer publishedYear;

    @Min(0)
    private Integer count;
}
