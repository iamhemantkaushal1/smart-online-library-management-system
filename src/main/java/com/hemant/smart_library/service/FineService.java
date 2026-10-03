package com.hemant.smart_library.service;

import com.hemant.smart_library.entity.BorrowTransaction;
import com.hemant.smart_library.entity.Fine;
import com.hemant.smart_library.exception.ResourceNotFoundException;
import com.hemant.smart_library.repository.BorrowTransactionRepository;
import com.hemant.smart_library.repository.FineRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class FineService {

    private static final double FINE_PER_DAY = 5.0;

    private final FineRepository fineRepository;
    private final BorrowTransactionRepository transactionRepository;

    public FineService(
            FineRepository fineRepository,
            BorrowTransactionRepository transactionRepository) {

        this.fineRepository = fineRepository;
        this.transactionRepository = transactionRepository;
    }


    // =========================================================
    // CALCULATE FINE
    // =========================================================

    public Fine calculateFine(Long transactionId) {

        BorrowTransaction transaction =
                transactionRepository.findById(transactionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found with id: "
                                                + transactionId));


        /*
         * Check whether a fine already exists
         * for this transaction.
         *
         * If it exists, update the existing fine.
         * Otherwise, create a new fine.
         */
        Fine fine = fineRepository
                .findByTransactionId(transactionId)
                .orElseGet(Fine::new);


        LocalDate endDate =
                transaction.getReturnDate();


        /*
         * If the book has not been returned,
         * calculate the fine up to today.
         */
        if (endDate == null) {
            endDate = LocalDate.now();
        }


        long overdueDays =
                ChronoUnit.DAYS.between(
                        transaction.getDueDate(),
                        endDate
                );


        /*
         * No negative overdue days.
         */
        if (overdueDays < 0) {
            overdueDays = 0;
        }


        double amount =
                overdueDays * FINE_PER_DAY;


        fine.setTransaction(transaction);

        fine.setOverdueDays(
                (int) overdueDays
        );

        fine.setAmount(amount);

        fine.setFineDate(
                LocalDate.now()
        );


        /*
         * If fine amount exists,
         * mark it UNPAID.
         *
         * But never change an already PAID
         * fine back to UNPAID.
         */
        if (amount > 0) {

            if (!"PAID".equalsIgnoreCase(
                    fine.getStatus())) {

                fine.setStatus("UNPAID");
            }

        } else {

            fine.setStatus("NO_FINE");
        }


        return fineRepository.save(fine);
    }


    // =========================================================
    // GET ALL FINES
    // =========================================================

    public List<Fine> getAllFines() {

        return fineRepository.findAll();
    }


    // =========================================================
    // GET FINE BY ID
    // =========================================================

    public Fine getFineById(Long id) {

        return fineRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Fine not found with id: "
                                        + id));
    }


    // =========================================================
    // GET FINES BY USER
    // =========================================================

    public List<Fine> getFinesByUser(Long userId) {

        return fineRepository
                .findByTransactionUserId(userId);
    }


    // =========================================================
    // PAY FINE
    // =========================================================

    public Fine payFine(Long id) {

        Fine fine = getFineById(id);


        if ("NO_FINE".equalsIgnoreCase(
                fine.getStatus())) {

            throw new IllegalStateException(
                    "This fine has no amount to pay");
        }


        if ("PAID".equalsIgnoreCase(
                fine.getStatus())) {

            throw new IllegalStateException(
                    "Fine is already paid");
        }


        fine.setStatus("PAID");

        return fineRepository.save(fine);
    }
}