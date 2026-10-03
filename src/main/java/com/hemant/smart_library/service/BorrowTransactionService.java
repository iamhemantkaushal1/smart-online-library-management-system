package com.hemant.smart_library.service;

import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.BookCopy;
import com.hemant.smart_library.entity.BorrowTransaction;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.exception.ResourceNotFoundException;
import com.hemant.smart_library.repository.BookCopyRepository;
import com.hemant.smart_library.repository.BorrowTransactionRepository;
import com.hemant.smart_library.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowTransactionService {

    private final BorrowTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BookCopyRepository bookCopyRepository;

    public BorrowTransactionService(
            BorrowTransactionRepository transactionRepository,
            UserRepository userRepository,
            BookCopyRepository bookCopyRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.bookCopyRepository = bookCopyRepository;
    }


    // =========================================================
    // ISSUE BOOK
    // =========================================================

    @Transactional
    public BorrowTransaction issueBook(
            Long userId,
            Long bookCopyId,
            int days) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));


        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book copy not found with id: "
                                        + bookCopyId));


        if (!"AVAILABLE".equalsIgnoreCase(bookCopy.getStatus())) {

            throw new IllegalStateException(
                    "Book copy is not available");

        }


        if (days <= 0) {

            throw new IllegalArgumentException(
                    "Issue duration must be greater than 0 days");

        }


        Book book = bookCopy.getBook();


        // Copy becomes issued
        bookCopy.setStatus("ISSUED");

        bookCopyRepository.save(bookCopy);


        // Update available book count
        if (book.getAvailableCopies() != null
                && book.getAvailableCopies() > 0) {

            book.setAvailableCopies(
                    book.getAvailableCopies() - 1
            );

        }


        BorrowTransaction transaction =
                new BorrowTransaction();


        transaction.setUser(user);

        transaction.setBookCopy(bookCopy);

        transaction.setIssueDate(
                LocalDate.now()
        );

        transaction.setDueDate(
                LocalDate.now().plusDays(days)
        );

        transaction.setStatus("ISSUED");


        return transactionRepository.save(transaction);
    }



    // =========================================================
    // RETURN BOOK
    // =========================================================

    @Transactional
    public BorrowTransaction returnBook(
            Long transactionId) {

        BorrowTransaction transaction =
                transactionRepository.findById(transactionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found with id: "
                                                + transactionId));


        if (!"ISSUED".equalsIgnoreCase(
                transaction.getStatus())
                &&
                !"RENEWED".equalsIgnoreCase(
                        transaction.getStatus())) {

            throw new IllegalStateException(
                    "This book has already been returned");

        }


        transaction.setReturnDate(
                LocalDate.now()
        );

        transaction.setStatus("RETURNED");


        BookCopy bookCopy =
                transaction.getBookCopy();


        bookCopy.setStatus("AVAILABLE");

        bookCopyRepository.save(bookCopy);


        // Increase available copies
        Book book = bookCopy.getBook();


        if (book.getAvailableCopies() == null) {

            book.setAvailableCopies(1);

        } else if (
                book.getTotalCopies() == null
                        ||
                        book.getAvailableCopies()
                                < book.getTotalCopies()) {

            book.setAvailableCopies(
                    book.getAvailableCopies() + 1
            );

        }


        return transactionRepository.save(
                transaction
        );
    }



    // =========================================================
    // RENEW BOOK
    // =========================================================

    @Transactional
    public BorrowTransaction renewBook(
            Long transactionId,
            int additionalDays) {

        BorrowTransaction transaction =
                transactionRepository.findById(transactionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found with id: "
                                                + transactionId));


        if (!"ISSUED".equalsIgnoreCase(
                transaction.getStatus())) {

            throw new IllegalStateException(
                    "Only issued books can be renewed");

        }


        if (additionalDays <= 0) {

            throw new IllegalArgumentException(
                    "Additional days must be greater than 0");

        }


        transaction.setDueDate(
                transaction.getDueDate()
                        .plusDays(additionalDays)
        );


        /*
         * Keep status as ISSUED.
         *
         * This is important because reports and dashboard
         * count ISSUED transactions.
         */
        transaction.setStatus("ISSUED");


        return transactionRepository.save(
                transaction
        );
    }



    // =========================================================
    // GET ALL TRANSACTIONS
    // =========================================================

    public List<BorrowTransaction> getAllTransactions() {

        return transactionRepository.findAll();

    }



    // =========================================================
    // GET TRANSACTION BY ID
    // =========================================================

    public BorrowTransaction getTransactionById(
            Long id) {

        return transactionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Transaction not found with id: "
                                        + id));

    }



    // =========================================================
    // GET USER TRANSACTIONS
    // =========================================================

    public List<BorrowTransaction> getTransactionsByUser(
            Long userId) {

        if (!userRepository.existsById(userId)) {

            throw new ResourceNotFoundException(
                    "User not found with id: " + userId);

        }

        return transactionRepository
                .findByUserId(userId);

    }

}