package com.hemant.smart_library.service;

import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.BookCopy;
import com.hemant.smart_library.exception.ResourceNotFoundException;
import com.hemant.smart_library.repository.BookCopyRepository;
import com.hemant.smart_library.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookCopyService {

    private final BookCopyRepository bookCopyRepository;
    private final BookRepository bookRepository;

    public BookCopyService(BookCopyRepository bookCopyRepository,
                           BookRepository bookRepository) {
        this.bookCopyRepository = bookCopyRepository;
        this.bookRepository = bookRepository;
    }

    public BookCopy addCopy(Long bookId, BookCopy bookCopy) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + bookId));

        bookCopy.setBook(book);
        bookCopy.setStatus("AVAILABLE");

        return bookCopyRepository.save(bookCopy);
    }

    public List<BookCopy> getAllCopies() {
        return bookCopyRepository.findAll();
    }

    public List<BookCopy> getCopiesByBook(Long bookId) {

        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException(
                    "Book not found with id: " + bookId);
        }

        return bookCopyRepository.findByBookId(bookId);
    }

    public BookCopy getCopyById(Long id) {

        return bookCopyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book copy not found with id: " + id));
    }

    public BookCopy updateStatus(Long id, String status) {

        BookCopy copy = getCopyById(id);

        copy.setStatus(status);

        return bookCopyRepository.save(copy);
    }

    public void deleteCopy(Long id) {

        BookCopy copy = getCopyById(id);

        bookCopyRepository.delete(copy);
    }
}