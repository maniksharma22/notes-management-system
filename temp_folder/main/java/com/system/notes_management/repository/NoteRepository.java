package com.system.notes_management.repository;

import com.system.notes_management.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByOrderByUpdatedAtDesc();
    List<Note> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);
}