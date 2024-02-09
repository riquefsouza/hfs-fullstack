package br.com.hfs.admin;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.hfs.admin.service.AdmMenuService;
import br.com.hfs.admin.service.AdmPageService;
import br.com.hfs.admin.service.AdmParameterCategoryService;
import br.com.hfs.admin.service.AdmParameterService;
import br.com.hfs.admin.service.AdmProfileService;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm11LimpezaTests {
 
    @Autowired
    private AdmParameterCategoryService admParameterCategoryService;

    @Autowired
    private AdmParameterService admParameterService;

    @Autowired
    private AdmPageService admPageService;

    @Autowired
    private AdmProfileService admProfileService;

    @Autowired
    private AdmMenuService admMenuService;

    @Test
    @Order(1)
    public void testLimpeza() {
        admMenuService.deleteAllNative();
        admProfileService.deleteAllPageProfileNative();
        admProfileService.deleteAll();
        admPageService.deleteAll();
        admParameterService.deleteAll();
        admParameterCategoryService.deleteAll();

        admMenuService.restartSequence();
        admProfileService.restartSequence();
        admPageService.restartSequence();
        admParameterService.restartSequence();
        admParameterCategoryService.restartSequence();
    }

}
