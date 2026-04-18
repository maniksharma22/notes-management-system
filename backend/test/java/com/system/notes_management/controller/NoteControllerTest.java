package com.system.notes_management.controller;

import com.system.notes_management.model.Note;
import com.system.notes_management.service.NoteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@WebMvcTest(NoteController.class)
public class NoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NoteService noteService;

    @Test
    void testCreateNote_Validation() throws Exception {
        String invalidNoteJson = "{\"title\": \"\", \"content\": \"Content\"}";
        mockMvc.perform(post("/api/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidNoteJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetAllNotes() throws Exception {
        when(noteService.getAllNotes()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/notes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}