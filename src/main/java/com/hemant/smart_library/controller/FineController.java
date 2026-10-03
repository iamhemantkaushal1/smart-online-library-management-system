package com.hemant.smart_library.controller;

import com.hemant.smart_library.dto.FineResponseDTO;
import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.BookCopy;
import com.hemant.smart_library.entity.BorrowTransaction;
import com.hemant.smart_library.entity.Fine;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.service.FineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @PostMapping("/calculate/{transactionId}")
    public FineResponseDTO calculateFine(
            @PathVariable Long transactionId) {

        return convertToDTO(
                fineService.calculateFine(transactionId)
        );
    }

    @GetMapping
    public List<FineResponseDTO> getAllFines() {

        return fineService.getAllFines()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public FineResponseDTO getFineById(
            @PathVariable Long id) {

        return convertToDTO(
                fineService.getFineById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public List<FineResponseDTO> getFinesByUser(
            @PathVariable Long userId) {

        return fineService.getFinesByUser(userId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @PutMapping("/{id}/pay")
    public FineResponseDTO payFine(
            @PathVariable Long id) {

        return convertToDTO(
                fineService.payFine(id)
        );
    }

    private FineResponseDTO convertToDTO(Fine fine) {

        BorrowTransaction transaction =
                fine.getTransaction();

        User user = transaction.getUser();

        BookCopy bookCopy =
                transaction.getBookCopy();

        Book book =
                bookCopy.getBook();

        FineResponseDTO.UserInfo userInfo =
                new FineResponseDTO.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        FineResponseDTO.BookInfo bookInfo =
                new FineResponseDTO.BookInfo(
                        book.getId(),
                        book.getTitle()
                );

        FineResponseDTO.BookCopyInfo bookCopyInfo =
                new FineResponseDTO.BookCopyInfo(
                        bookCopy.getId(),
                        bookCopy.getCopyCode(),
                        bookCopy.getStatus(),
                        bookInfo
                );

        FineResponseDTO.TransactionInfo transactionInfo =
                new FineResponseDTO.TransactionInfo(
                        transaction.getId(),
                        transaction.getIssueDate(),
                        transaction.getDueDate(),
                        transaction.getReturnDate(),
                        transaction.getStatus(),
                        userInfo,
                        bookCopyInfo
                );

        return new FineResponseDTO(
                fine.getId(),
                fine.getAmount(),
                fine.getOverdueDays(),
                fine.getFineDate(),
                fine.getStatus(),
                transactionInfo
        );
    }
}