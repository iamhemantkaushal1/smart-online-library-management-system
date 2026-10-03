package com.hemant.smart_library.service;

import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.Reservation;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.exception.ResourceNotFoundException;
import com.hemant.smart_library.repository.BookRepository;
import com.hemant.smart_library.repository.ReservationRepository;
import com.hemant.smart_library.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {

        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public Reservation reserveBook(Long userId, Long bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + bookId));

        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("WAITING");

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {

        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation not found with id: " + id));
    }

    public List<Reservation> getReservationsByBook(Long bookId) {

        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException(
                    "Book not found with id: " + bookId);
        }

        return reservationRepository
                .findByBookIdOrderByReservationDateAsc(bookId);
    }

    public List<Reservation> getReservationsByUser(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User not found with id: " + userId);
        }

        return reservationRepository.findByUserId(userId);
    }

    public Reservation updateStatus(Long id, String status) {

        Reservation reservation = getReservationById(id);

        reservation.setStatus(status);

        return reservationRepository.save(reservation);
    }

    public void cancelReservation(Long id) {

        Reservation reservation = getReservationById(id);

        reservation.setStatus("CANCELLED");

        reservationRepository.save(reservation);
    }
}