package com.hemant.smart_library.controller;

import com.hemant.smart_library.dto.WishlistResponseDTO;
import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.entity.Wishlist;
import com.hemant.smart_library.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(
            WishlistService wishlistService) {

        this.wishlistService = wishlistService;
    }

    @PostMapping
    public WishlistResponseDTO addToWishlist(
            @RequestParam Long userId,
            @RequestParam Long bookId) {

        return convertToDTO(
                wishlistService.addToWishlist(
                        userId,
                        bookId
                )
        );
    }

    @GetMapping("/user/{userId}")
    public List<WishlistResponseDTO> getUserWishlist(
            @PathVariable Long userId) {

        return wishlistService
                .getUserWishlist(userId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @DeleteMapping("/{id}")
    public String removeFromWishlist(
            @PathVariable Long id) {

        wishlistService.removeFromWishlist(id);

        return "Book removed from wishlist successfully";
    }

    private WishlistResponseDTO convertToDTO(
            Wishlist wishlist) {

        User user = wishlist.getUser();
        Book book = wishlist.getBook();

        WishlistResponseDTO.UserInfo userInfo =
                new WishlistResponseDTO.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                );

        WishlistResponseDTO.BookInfo bookInfo =
                new WishlistResponseDTO.BookInfo(
                        book.getId(),
                        book.getTitle(),
                        book.getIsbn(),
                        book.getAuthor(),
                        book.getCategory()
                );

        return new WishlistResponseDTO(
                wishlist.getId(),
                wishlist.getAddedAt(),
                userInfo,
                bookInfo
        );
    }
}