package com.hemant.smart_library.dto;

import java.time.LocalDate;

public class FineResponseDTO {

    private Long id;
    private Double amount;
    private Integer overdueDays;
    private LocalDate fineDate;
    private String status;

    private TransactionInfo transaction;

    public FineResponseDTO() {
    }

    public FineResponseDTO(
            Long id,
            Double amount,
            Integer overdueDays,
            LocalDate fineDate,
            String status,
            TransactionInfo transaction) {

        this.id = id;
        this.amount = amount;
        this.overdueDays = overdueDays;
        this.fineDate = fineDate;
        this.status = status;
        this.transaction = transaction;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Integer getOverdueDays() {
        return overdueDays;
    }

    public void setOverdueDays(Integer overdueDays) {
        this.overdueDays = overdueDays;
    }

    public LocalDate getFineDate() {
        return fineDate;
    }

    public void setFineDate(LocalDate fineDate) {
        this.fineDate = fineDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public TransactionInfo getTransaction() {
        return transaction;
    }

    public void setTransaction(TransactionInfo transaction) {
        this.transaction = transaction;
    }

    public static class TransactionInfo {

        private Long id;
        private LocalDate issueDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        private String status;

        private UserInfo user;
        private BookCopyInfo bookCopy;

        public TransactionInfo() {
        }

        public TransactionInfo(
                Long id,
                LocalDate issueDate,
                LocalDate dueDate,
                LocalDate returnDate,
                String status,
                UserInfo user,
                BookCopyInfo bookCopy) {

            this.id = id;
            this.issueDate = issueDate;
            this.dueDate = dueDate;
            this.returnDate = returnDate;
            this.status = status;
            this.user = user;
            this.bookCopy = bookCopy;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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