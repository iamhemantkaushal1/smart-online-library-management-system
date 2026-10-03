package com.hemant.smart_library.controller;

import com.hemant.smart_library.dto.ReservationResponseDTO;
import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.Reservation;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService) {

        this.reservationService = reservationService;
    }

    @PostMapping
    public ReservationResponseDTO reserveBook(
            @RequestParam Long userId,
            @RequestParam Long bookId) {

        return convertToDTO(
                reservationService.reserveBook(
                        userId,
                        bookId
                )
        );
    }

    @GetMapping
    public List<ReservationResponseDTO> getAllReservations() {

        return reservationService
                .getAllReservations()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ReservationResponseDTO getReservationById(
            @PathVariable Long id) {

        return convertToDTO(
                reservationService.getReservationById(id)
        );
    }

    @GetMapping("/book/{bookId}")
    public List<ReservationResponseDTO> getReservationsByBook(
            @PathVariable Long bookId) {

        return reservationService
                .getReservationsByBook(bookId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @GetMapping("/user/{userId}")
    public List<ReservationResponseDTO> getReservationsByUser(
            @PathVariable Long userId) {

        return reservationService
                .getReservationsByUser(userId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @PutMapping("/{id}/status")
    public ReservationResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return convertToDTO(
                reservationService.updateStatus(
                        id,
                        status
                )
        );
    }

    @PutMapping("/{id}/cancel")
    public String cancelReservation(
            @PathVariable Long id) {

        reservationService.cancelReservation(id);

        return "Reservation cancelled successfully";
    }

    private ReservationResponseDTO convertToDTO(
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