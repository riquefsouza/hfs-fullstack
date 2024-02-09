package br.com.hfs.admin;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Optional;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import br.com.hfs.BaseApplicationTest;
import br.com.hfs.admin.model.AdmMenu;
import br.com.hfs.admin.service.AdmMenuService;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm16MenuServiceTests extends BaseApplicationTest {

    @Autowired
    private AdmMenuService admMenuService;

    @Test
    @Order(1)
    public void testSave() {
        admMenuService.deleteAll();
        admMenuService.restartSequence();

        // given
        AdmMenu menu = new AdmMenu("Administrativo", null, null, 1);        

        // when
        AdmMenu savedMenu = admMenuService.insert(menu);
        AdmMenu resultado = admMenuService.getMenuById(savedMenu.getId()).orElseThrow();
        
        // then
        assertEquals(savedMenu.getId(), menu.getId());
        assertEquals("Administrativo", resultado.getDescription());
    }

    @Test
    @Order(2)
    public void testUpdate() {
        // given
        AdmMenu menu = new AdmMenu("Administrativo", null, null, 1);

        ExampleMatcher matcher = ExampleMatcher.matching()
            .withMatcher("Administrativo", match -> match.exact());

        Example<AdmMenu> example = Example.of(menu, matcher);

        Optional<AdmMenu> resultado = admMenuService.getRepository().findBy(example, 
            q -> q.sortBy(Sort.by("description").descending()).first()
        );
        AdmMenu m = new AdmMenu("ALTERADO Administrativo", null, null, 1);
        m.setId(resultado.get().getId());        

        // when
        int total = admMenuService.updateMenu(m.getDescription(), m.getIdMenuParent(),
            m.getIdPage(), m.getOrder(), m.getId());

        // then
        assertEquals(1, total);
    }

    @Test
    @Order(3)
    public void testDelete() {
        // given
        AdmMenu m = admMenuService.getMenuById(1L).orElseThrow();

        // when
        int total = admMenuService.deleteMenu(m.getId());

         // then
         assertEquals(1, total);
    }
}