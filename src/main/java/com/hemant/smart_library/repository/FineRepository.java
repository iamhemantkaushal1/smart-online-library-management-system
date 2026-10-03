package com.hemant.smart_library.repository;

import com.hemant.smart_library.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {

    List<Fine> findByStatus(String status);

    List<Fine> findByTransactionUserId(Long userId);

    Optional<Fine> findByTransactionId(Long transactionId);
}