package com.hemant.smart_library.controller;

import com.hemant.smart_library.dto.NotificationResponseDTO;
import com.hemant.smart_library.entity.Notification;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @PostMapping
    public NotificationResponseDTO createNotification(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String message) {

        return convertToDTO(
                notificationService.createNotification(
                        userId,
                        title,
                        message
                )
        );
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponseDTO> getUserNotifications(
            @PathVariable Long userId) {

        return notificationService
                .getUserNotifications(userId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @GetMapping("/user/{userId}/unread")
    public List<NotificationResponseDTO> getUnreadNotifications(
            @PathVariable Long userId) {

        return notificationService
                .getUnreadNotifications(userId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @PutMapping("/{id}/read")
    public NotificationResponseDTO markAsRead(
            @PathVariable Long id) {

        return convertToDTO(
                notificationService.markAsRead(id)
        );
    }

    @DeleteMapping("/{id}")
    public String deleteNotification(
            @PathVariable Long id) {

        notificationService.deleteNotification(id);

        return "Notification deleted successfully";
    }

    private NotificationResponseDTO convertToDTO(
            Notification notification) {

        User user = notification.getUser();

        NotificationResponseDTO.UserInfo userInfo =
                new NotificationResponseDTO.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        return new NotificationResponseDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt(),
                userInfo
        );
    }
}