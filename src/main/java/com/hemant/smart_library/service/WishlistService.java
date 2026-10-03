package com.hemant.smart_library.service;

import com.hemant.smart_library.entity.Book;
import com.hemant.smart_library.entity.User;
import com.hemant.smart_library.entity.Wishlist;
import com.hemant.smart_library.exception.ResourceNotFoundException;
import com.hemant.smart_library.repository.BookRepository;
import com.hemant.smart_library.repository.UserRepository;
import com.hemant.smart_library.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public WishlistService(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {

        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public Wishlist addToWishlist(
            Long userId,
            Long bookId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found with id: " + bookId));

        if (wishlistRepository
                .findByUserIdAndBookId(userId, bookId)
                .isPresent()) {

            throw new IllegalStateException(
                    "Book is already in wishlist");
        }

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);
        wishlist.setBook(book);
        wishlist.setAddedAt(LocalDateTime.now());

        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getUserWishlist(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User not found with id: " + userId);
        }

        return wishlistRepository.findByUserId(userId);
    }

    public void removeFromWishlist(Long id) {

        Wishlist wishlist =
                wishlistRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Wishlist item not found with id: " + id));

        wishlistRepository.delete(wishlist);
    }
}