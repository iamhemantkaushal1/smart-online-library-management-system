package com.hemant.smart_library.controller;

import com.hemant.smart_library.dto.BorrowTransactionResponseDTO;
import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.BookCopy;
import com.hemant.smart_library.entity.BorrowTransaction;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.service.BorrowTransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class BorrowTransactionController {

    private final BorrowTransactionService transactionService;

    public BorrowTransactionController(
            BorrowTransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @PostMapping("/issue")
    public BorrowTransactionResponseDTO issueBook(
            @RequestParam Long userId,
            @RequestParam Long bookCopyId,
            @RequestParam(defaultValue = "14") int days) {

        BorrowTransaction transaction =
                transactionService.issueBook(
                        userId,
                        bookCopyId,
                        days
                );

        return convertToDTO(transaction);
    }

    @PutMapping("/{id}/return")
    public BorrowTransactionResponseDTO returnBook(
            @PathVariable Long id) {

        BorrowTransaction transaction =
                transactionService.returnBook(id);

        return convertToDTO(transaction);
    }

    @PutMapping("/{id}/renew")
    public BorrowTransactionResponseDTO renewBook(
            @PathVariable Long id,
            @RequestParam(defaultValue = "7") int additionalDays) {

        BorrowTransaction transaction =
                transactionService.renewBook(
                        id,
                        additionalDays
                );

        return convertToDTO(transaction);
    }

    @GetMapping
    public List<BorrowTransactionResponseDTO> getAllTransactions() {

        return transactionService.getAllTransactions()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public BorrowTransactionResponseDTO getTransactionById(
            @PathVariable Long id) {

        BorrowTransaction transaction =
                transactionService.getTransactionById(id);

        return convertToDTO(transaction);
    }

    @GetMapping("/user/{userId}")
    public List<BorrowTransactionResponseDTO> getTransactionsByUser(
            @PathVariable Long userId) {

        return transactionService
                .getTransactionsByUser(userId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private BorrowTransactionResponseDTO convertToDTO(
            BorrowTransaction transaction) {

        User user = transaction.getUser();
        BookCopy bookCopy = transaction.getBookCopy();
        Book book = bookCopy.getBook();

        BorrowTransactionResponseDTO.UserInfo userInfo =
                new BorrowTransactionResponseDTO.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        BorrowTransactionResponseDTO.BookInfo bookInfo =
                new BorrowTransactionResponseDTO.BookInfo(
                        book.getId(),
                        book.getTitle()
                );

        BorrowTransactionResponseDTO.BookCopyInfo bookCopyInfo =
                new BorrowTransactionResponseDTO.BookCopyInfo(
                        bookCopy.getId(),
                        bookCopy.getCopyCode(),
                        bookCopy.getStatus(),
                        bookInfo
                );

        return new BorrowTransactionResponseDTO(
                transaction.getId(),
                userInfo,
                bookCopyInfo,
                transaction.getIssueDate(),
                transaction.getDueDate(),
                transaction.getReturnDate(),
                transaction.getStatus()
        );
    }
}