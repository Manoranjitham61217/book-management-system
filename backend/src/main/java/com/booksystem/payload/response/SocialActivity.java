package com.booksystem.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocialActivity {
    private String username;
    private String action; // e.g., "started reading", "rated", "added"
    private String bookTitle;
    private String timestamp;
}
