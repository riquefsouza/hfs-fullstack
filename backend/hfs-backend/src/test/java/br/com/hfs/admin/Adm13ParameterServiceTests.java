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
import br.com.hfs.admin.model.AdmParameter;
import br.com.hfs.admin.service.AdmParameterService;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm13ParameterServiceTests extends BaseApplicationTest {

    @Autowired
    private AdmParameterService service;

    @Test
    @Order(1)
    public void testSave() {
        service.deleteAll();
        service.restartSequence();
        
        // given
        AdmParameter obj = new AdmParameter("false",
        "Bloquear o sistema para que os usuários, exceto do administador, não façam login",
        "BLOQUEAR_LOGIN",2L);

        // when
        AdmParameter saved = service.insert(obj);
        AdmParameter resultado = service.findById(saved.getId()).orElseThrow();
        
        // then
        assertEquals(saved.getId(), obj.getId());
        assertEquals("BLOQUEAR_LOGIN", resultado.getCode());
    }

    @Test
    @Order(2)
    public void testUpdate() {
        // given
        List<AdmParameter> resultado = service.findByDescriptionLike("Bloquear o sistema%");

        AdmParameter obj = new AdmParameter("false",
        "Bloquear o sistema para que os usuários, exceto do administador, não façam login",
        "ALTERADO BLOQUEAR_LOGIN",2L);
        obj.setId(resultado.get(0).getId());

        // when
        AdmParameter updated = service.update(obj);

        // then
        assertEquals("ALTERADO BLOQUEAR_LOGIN", updated.getCode());
    }

    @Test
    @Order(3)
    public void testDelete() {
        // given
        AdmParameter obj = service.findById(1L).orElseThrow();

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
        String json = getAdmParameterJson();
        ObjectMapper objectMapper = new ObjectMapper();
        List<AdmParameter> lista = objectMapper.readValue(json, 
            new TypeReference<List<AdmParameter>>(){});
        
        lista.forEach(param -> param.setIdAdmParameterCategory(param.getAdmParameterCategory().getId()));

        // when
        List<AdmParameter> saved = service.getRepository().saveAllAndFlush(lista);        
        
        // then
        assertEquals(saved.size(), lista.size());
    }

}
