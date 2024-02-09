package br.com.hfs.admin;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.hfs.BaseApplicationTest;
import br.com.hfs.admin.model.AdmParameterCategory;
import br.com.hfs.admin.service.AdmParameterCategoryService;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm12ParameterCategoryServiceTests extends BaseApplicationTest {

    @Autowired
    private AdmParameterCategoryService service;

    @Test
    @Order(1)
    public void testSave() {
        service.deleteAll();
        service.restartSequence();

        // given
        AdmParameterCategory obj = new AdmParameterCategory("Login Parameters", 2L);

        // when
        AdmParameterCategory saved = service.insert(obj);
        AdmParameterCategory resultado = service.findById(saved.getId()).orElseThrow();
        
        // then
        assertEquals(saved.getId(), obj.getId());
        assertEquals("Login Parameters", resultado.getDescription());
    }

    @Test
    @Order(2)
    public void testUpdate() {
        // given
        List<AdmParameterCategory> resultado = service.findByDescriptionLike("Login%");

        AdmParameterCategory obj = new AdmParameterCategory("ALTERADO Login Parameters", 2000L);
        obj.setId(resultado.get(0).getId());

        // when
        AdmParameterCategory updated = service.update(obj);

        // then
        assertEquals("ALTERADO Login Parameters", updated.getDescription());
        assertEquals(2000L, updated.getOrder());
    }

    @Test
    @Order(3)
    public void testDelete() {
        // given
        AdmParameterCategory obj = service.findById(1L).orElseThrow();

        // when
        service.delete(obj);

         // then         
         assertEquals(0, service.count());
    }
	    
    @Test
    @Order(4)
    public void testSaveAll() throws JsonMappingException, JsonProcessingException {
        service.deleteAll();
        service.restartSequence();

        // given
        String json = getAdmParameterCategoryJson();
        ObjectMapper objectMapper = new ObjectMapper();
        List<AdmParameterCategory> lista = objectMapper.readValue(json, 
            new TypeReference<List<AdmParameterCategory>>(){});

        // when
        List<AdmParameterCategory> saved = service.getRepository().saveAllAndFlush(lista);        
        
        // then
        assertEquals(saved.size(), lista.size());
    }

}
