package com.hemant.smart_library.repository;

import com.hemant.smart_library.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}