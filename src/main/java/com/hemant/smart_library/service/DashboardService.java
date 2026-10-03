package com.hemant.smart_library.service;

import com.hemant.smart_library.dto.DashboardDTO;
import com.hemant.smart_library.repository.BookCopyRepository;
import com.hemant.smart_library.repository.BookRepository;
import com.hemant.smart_library.repository.BorrowTransactionRepository;
import com.hemant.smart_library.repository.FineRepository;
import com.hemant.smart_library.repository.ReservationRepository;
import com.hemant.smart_library.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BorrowTransactionRepository transactionRepository;
    private final ReservationRepository reservationRepository;
    private final FineRepository fineRepository;

    public DashboardService(
            UserRepository userRepository,
            BookRepository bookRepository,
            BookCopyRepository bookCopyRepository,
            BorrowTransactionRepository transactionRepository,
            ReservationRepository reservationRepository,
            FineRepository fineRepository) {

        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.transactionRepository = transactionRepository;
        this.reservationRepository = reservationRepository;
        this.fineRepository = fineRepository;
    }

    public DashboardDTO getDashboard() {

        long totalUsers = userRepository.count();
        long totalBooks = bookRepository.count();
        long totalBookCopies = bookCopyRepository.count();

        long availableCopies =
                bookCopyRepository.findByStatus("AVAILABLE").size();

        long issuedCopies =
                bookCopyRepository.findByStatus("ISSUED").size();

        long totalReservations = reservationRepository.count();

        long totalTransactions = transactionRepository.count();

        long totalFines = fineRepository.count();

        long unpaidFines =
                fineRepository.findByStatus("UNPAID").size();

        return new DashboardDTO(
                totalUsers,
                totalBooks,
                totalBookCopies,
                availableCopies,
                issuedCopies,
                totalReservations,
                totalTransactions,
                totalFines,
                unpaidFines
        );
    }
}