package com.hemant.smart_library.dto;

import java.time.LocalDate;

public class BorrowTransactionResponseDTO {

    private Long id;

    private UserInfo user;
    private BookCopyInfo bookCopy;

    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;

    public BorrowTransactionResponseDTO() {
    }

    public BorrowTransactionResponseDTO(
            Long id,
            UserInfo user,
            BookCopyInfo bookCopy,
            LocalDate issueDate,
            LocalDate dueDate,
            LocalDate returnDate,
            String status) {

        this.id = id;
        this.user = user;
        this.bookCopy = bookCopy;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public BookCopyInfo getBookCopy() {
        return bookCopy;
    }

    public void setBookCopy(BookCopyInfo bookCopy) {
        this.bookCopy = bookCopy;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static class UserInfo {

        private Long id;
        private String name;
        private String email;
        private String role;

        public UserInfo() {
        }

        public UserInfo(Long id, String name, String email, String role) {
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

    public static class BookCopyInfo {

        private Long id;
        private String copyCode;
        private String status;
        private BookInfo book;

        public BookCopyInfo() {
        }

        public BookCopyInfo(
                Long id,
                String copyCode,
                String status,
                BookInfo book) {

            this.id = id;
            this.copyCode = copyCode;
            this.status = status;
            this.book = book;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getCopyCode() {
            return copyCode;
        }

        public void setCopyCode(String copyCode) {
            this.copyCode = copyCode;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public BookInfo getBook() {
            return book;
        }

        public void setBook(BookInfo book) {
            this.book = book;
        }
    }

    public static class BookInfo {

        private Long id;
        private String title;

        public BookInfo() {
        }

        public BookInfo(Long id, String title) {
            this.id = id;
            this.title = title;
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
    }
}