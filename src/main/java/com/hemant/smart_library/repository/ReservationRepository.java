package com.hemant.smart_library.repository;

import com.hemant.smart_library.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByBookIdOrderByReservationDateAsc(Long bookId);

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByStatus(String status);

    Optional<Reservation> findByUserIdAndBookIdAndStatus(
            Long userId,
            Long bookId,
            String status
    );
}