package com.hemant.smart_library.controller;

import com.hemant.smart_library.entity.BookCopy;
import com.hemant.smart_library.service.BookCopyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book-copies")
public class BookCopyController {

    private final BookCopyService bookCopyService;

    public BookCopyController(BookCopyService bookCopyService) {
        this.bookCopyService = bookCopyService;
    }

    // Add a new book copy
    @PostMapping("/book/{bookId}")
    public BookCopy addCopy(
            @PathVariable Long bookId,
            @RequestBody BookCopy bookCopy) {

        return bookCopyService.addCopy(bookId, bookCopy);
    }

    // Get all book copies
    @GetMapping
    public List<BookCopy> getAllCopies() {
        return bookCopyService.getAllCopies();
    }

    // Get copies of a particular book
    @GetMapping("/book/{bookId}")
    public List<BookCopy> getCopiesByBook(
            @PathVariable Long bookId) {

        return bookCopyService.getCopiesByBook(bookId);
    }

    // Get copy by ID
    @GetMapping("/{id}")
    public BookCopy getCopyById(
            @PathVariable Long id) {

        return bookCopyService.getCopyById(id);
    }

    // Change copy status
    @PutMapping("/{id}/status")
    public BookCopy updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return bookCopyService.updateStatus(id, status);
    }

    // Delete copy
    @DeleteMapping("/{id}")
    public String deleteCopy(
            @PathVariable Long id) {

        bookCopyService.deleteCopy(id);

        return "Book copy deleted successfully";
    }
}