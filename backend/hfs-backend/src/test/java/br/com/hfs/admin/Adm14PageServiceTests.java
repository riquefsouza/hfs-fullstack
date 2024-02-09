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
import br.com.hfs.admin.model.AdmPage;
import br.com.hfs.admin.service.AdmPageService;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm14PageServiceTests extends BaseApplicationTest {

    @Autowired
    private AdmPageService service;

    @Test
    @Order(1)
    public void testSave() {
        service.deleteAll();
        service.restartSequence();
        
        // given
        AdmPage obj = new AdmPage("Categoria dos Parâmetros", "/admin/admParameterCategory");
/*
        AdmProfile p1 = new AdmProfile(1L, "Administrador", true, false);
        Set<AdmProfile> profiles = new HashSet<>();
        profiles.add(p1);
        obj.setAdmProfiles(profiles);
 */
        // when
        AdmPage saved = service.insert(obj);
        AdmPage resultado = service.findById(saved.getId()).orElseThrow();
        
        // then
        assertEquals(saved.getId(), obj.getId());
        assertEquals("/admin/admParameterCategory", resultado.getUrl());
    }

    @Test
    @Order(2)
    public void testUpdate() {
        // given
        List<AdmPage> resultado = service.findByDescriptionLike("Categoria dos Parâmetros%");

        AdmPage obj = new AdmPage("ALTERADO Categoria dos Parâmetros", "/admin/admParameterCategory");
        obj.setId(resultado.get(0).getId());

        // when
        AdmPage updated = service.update(obj);

        // then
        assertEquals("ALTERADO Categoria dos Parâmetros", updated.getDescription());
    }

    @Test
    @Order(3)
    public void testDelete() {
        // given
        AdmPage obj = service.findById(1L).orElseThrow();

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
        String json = getAdmPageJson();
        ObjectMapper objectMapper = new ObjectMapper();
        List<AdmPage> lista = objectMapper.readValue(json, 
            new TypeReference<List<AdmPage>>(){});
        
        // when
        List<AdmPage> saved = service.getRepository().saveAllAndFlush(lista);        
        
        // then
        assertEquals(saved.size(), lista.size());
    }

}
