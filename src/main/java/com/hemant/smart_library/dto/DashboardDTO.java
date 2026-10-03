package com.hemant.smart_library.dto;

public class DashboardDTO {

    private long totalUsers;
    private long totalBooks;
    private long totalBookCopies;
    private long availableCopies;
    private long issuedCopies;
    private long totalReservations;
    private long totalTransactions;
    private long totalFines;
    private long unpaidFines;

    public DashboardDTO() {
    }

    public DashboardDTO(
            long totalUsers,
            long totalBooks,
            long totalBookCopies,
            long availableCopies,
            long issuedCopies,
            long totalReservations,
            long totalTransactions,
            long totalFines,
            long unpaidFines) {

        this.totalUsers = totalUsers;
        this.totalBooks = totalBooks;
        this.totalBookCopies = totalBookCopies;
        this.availableCopies = availableCopies;
        this.issuedCopies = issuedCopies;
        this.totalReservations = totalReservations;
        this.totalTransactions = totalTransactions;
        this.totalFines = totalFines;
        this.unpaidFines = unpaidFines;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalBookCopies() {
        return totalBookCopies;
    }

    public void setTotalBookCopies(long totalBookCopies) {
        this.totalBookCopies = totalBookCopies;
    }

    public long getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(long availableCopies) {
        this.availableCopies = availableCopies;
    }

    public long getIssuedCopies() {
        return issuedCopies;
    }

    public void setIssuedCopies(long issuedCopies) {
        this.issuedCopies = issuedCopies;
    }

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getTotalFines() {
        return totalFines;
    }

    public void setTotalFines(long totalFines) {
        this.totalFines = totalFines;
    }

    public long getUnpaidFines() {
        return unpaidFines;
    }

    public void setUnpaidFines(long unpaidFines) {
        this.unpaidFines = unpaidFines;
    }
}