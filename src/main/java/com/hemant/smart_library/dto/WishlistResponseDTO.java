package com.hemant.smart_library.dto;

import java.time.LocalDateTime;

public class WishlistResponseDTO {

    private Long id;
    private LocalDateTime addedAt;

    private UserInfo user;
    private BookInfo book;

    public WishlistResponseDTO() {
    }

    public WishlistResponseDTO(
            Long id,
            LocalDateTime addedAt,
            UserInfo user,
            BookInfo book) {

        this.id = id;
        this.addedAt = addedAt;
        this.user = user;
        this.book = book;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public BookInfo getBook() {
        return book;
    }

    public void setBook(BookInfo book) {
        this.book = book;
    }

    public static class UserInfo {

        private Long id;
        private String name;
        private String email;
        private String role;

        public UserInfo() {
        }

        public UserInfo(
                Long id,
                String name,
                String email,
                String role) {

            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class BookInfo {

        private Long id;
        private String title;
        private String isbn;
        private String author;
        private String category;

        public BookInfo() {
        }

        public BookInfo(
                Long id,
                String title,
                String isbn,
                String author,
                String category) {

            this.id = id;
            this.title = title;
            this.isbn = isbn;
            this.author = author;
            this.category = category;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getIsbn() {
            return isbn;
        }

        public void setIsbn(String isbn) {
            this.isbn = isbn;
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }
}