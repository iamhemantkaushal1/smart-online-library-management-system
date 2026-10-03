package com.hemant.smart_library.repository;

import com.hemant.smart_library.entity.BorrowTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowTransactionRepository
        extends JpaRepository<BorrowTransaction, Long> {

    List<BorrowTransaction> findByUserId(Long userId);

    List<BorrowTransaction> findByStatus(String status);
}