package com.hemant.smart_library.controller;

import com.hemant.smart_library.dto.BorrowTransactionResponseDTO;
import com.hemant.smart_library.dto.FineResponseDTO;
import com.hemant.smart_library.dto.ReservationResponseDTO;
import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.BookCopy;
import com.hemant.smart_library.entity.BorrowTransaction;
import com.hemant.smart_library.entity.Fine;
import com.hemant.smart_library.entity.Reservation;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.repository.BorrowTransactionRepository;
import com.hemant.smart_library.repository.FineRepository;
import com.hemant.smart_library.repository.ReservationRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final BorrowTransactionRepository transactionRepository;
    private final FineRepository fineRepository;
    private final ReservationRepository reservationRepository;

    public ReportController(
            BorrowTransactionRepository transactionRepository,
            FineRepository fineRepository,
            ReservationRepository reservationRepository) {

        this.transactionRepository = transactionRepository;
        this.fineRepository = fineRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/issued")
    public List<BorrowTransactionResponseDTO> getIssuedBooks() {

        return transactionRepository
                .findByStatus("ISSUED")
                .stream()
                .map(this::convertTransactionToDTO)
                .toList();
    }

    @GetMapping("/overdue")
    public List<BorrowTransactionResponseDTO> getOverdueBooks() {

        return transactionRepository
                .findAll()
                .stream()
                .filter(transaction ->
                        "ISSUED".equalsIgnoreCase(
                                transaction.getStatus()
                        )
                                && transaction.getDueDate() != null
                                && transaction.getDueDate()
                                .isBefore(LocalDate.now())
                )
                .map(this::convertTransactionToDTO)
                .toList();
    }

    @GetMapping("/unpaid-fines")
    public List<FineResponseDTO> getUnpaidFines() {

        return fineRepository
                .findByStatus("UNPAID")
                .stream()
                .map(this::convertFineToDTO)
                .toList();
    }

    @GetMapping("/reservations")
    public List<ReservationResponseDTO> getActiveReservations() {

        return reservationRepository
                .findByStatus("WAITING")
                .stream()
                .map(this::convertReservationToDTO)
                .toList();
    }

    @GetMapping("/transactions")
    public List<BorrowTransactionResponseDTO> getAllTransactions() {

        return transactionRepository
                .findAll()
                .stream()
                .map(this::convertTransactionToDTO)
                .toList();
    }

    @GetMapping("/fines")
    public List<FineResponseDTO> getAllFines() {

        return fineRepository
                .findAll()
                .stream()
                .map(this::convertFineToDTO)
                .toList();
    }

    // ---------------------------------------------------------
    // Borrow Transaction DTO
    // ---------------------------------------------------------

    private BorrowTransactionResponseDTO convertTransactionToDTO(
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

    // ---------------------------------------------------------
    // Fine DTO
    // ---------------------------------------------------------

    private FineResponseDTO convertFineToDTO(Fine fine) {

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

    // ---------------------------------------------------------
    // Reservation DTO
    // ---------------------------------------------------------

    private ReservationResponseDTO convertReservationToDTO(
            Reservation reservation) {

        User user = reservation.getUser();
        Book book = reservation.getBook();

        ReservationResponseDTO.UserInfo userInfo =
                new ReservationResponseDTO.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        ReservationResponseDTO.BookInfo bookInfo =
                new ReservationResponseDTO.BookInfo(
                        book.getId(),
                        book.getTitle(),
                        book.getIsbn(),
                        book.getAuthor(),
                        book.getCategory()
                );

        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getReservationDate(),
                reservation.getStatus(),
                userInfo,
                bookInfo
        );
    }
}