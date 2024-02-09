package br.com.hfs.admin;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
import br.com.hfs.admin.model.AdmProfile;
import br.com.hfs.admin.service.AdmProfileService;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm15ProfileServiceTests extends BaseApplicationTest {

    @Autowired
    private AdmProfileService service;

    @Test
    @Order(1)
    public void testSave() {
        service.deleteAll();
        service.restartSequence();
        
        // given
        AdmProfile obj = new AdmProfile("Administrador", true, false);
        AdmPage page1 = new AdmPage(1L, "Categoria dos Parâmetros", "/admin/admParameterCategory");
        AdmPage page2 = new AdmPage(2L, "Parâmetros", "/admin/admParameter");
        Set<AdmPage> pages = new HashSet<>();
        pages.add(page1);
        pages.add(page2);
        obj.setAdmPages(pages);

        // when
        AdmProfile saved = service.insert(obj);
        AdmProfile resultado = service.findById(saved.getId()).orElseThrow();
        
        // then
        assertEquals(saved.getId(), obj.getId());
        assertEquals("Administrador", resultado.getDescription());
    }

    @Test
    @Order(2)
    public void testUpdate() {
        // given
        List<AdmProfile> resultado = service.findByDescriptionLike("Administrador%");

        AdmProfile obj = new AdmProfile("ALTERADO Administrador", true, false);
        AdmPage page1 = new AdmPage(1L, "Categoria dos Parâmetros", "/admin/admParameterCategory");
        AdmPage page2 = new AdmPage(2L, "Parâmetros", "/admin/admParameter");
        Set<AdmPage> pages = new HashSet<>();
        pages.add(page1);
        pages.add(page2);
        obj.setAdmPages(pages);
        obj.setId(resultado.get(0).getId());

        // when
        AdmProfile updated = service.update(obj);

        // then
        assertEquals("ALTERADO Administrador", updated.getDescription());
    }

    @Test
    @Order(3)
    public void testDelete() {
        // given
        AdmProfile obj = service.findById(1L).orElseThrow();

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
        String json = getAdmProfileJson();
        ObjectMapper objectMapper = new ObjectMapper();
        List<AdmProfile> lista = objectMapper.readValue(json, 
            new TypeReference<List<AdmProfile>>(){});
        
        // when
        List<AdmProfile> saved = service.getRepository().saveAllAndFlush(lista);        
        
        // then
        assertEquals(saved.size(), lista.size());
    }

}
