package br.com.hfs.hfsfullstack;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import br.com.hfs.BaseApplicationTest;
import br.com.hfs.admin.service.AdmProfileService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm25ProfileTests extends BaseApplicationTest {
	
    @Autowired
	protected MockMvc mvc;

	private static final String URL = "/admProfile";
    
    private static String idUpdate = "";

	@Autowired
	private AdmProfileService service;

    private String getDados(int ordem) {
        String dados = getAdmProfileJson();

        JsonArray convertedObject = new Gson().fromJson(dados, JsonArray.class);

        if (convertedObject.isJsonArray()){
            //JsonObject obj = convertedObject.get(ordem).getAsJsonObject();
            //idUpdate = obj.get("id").getAsString();

            return convertedObject.get(ordem).toString();
        }

		return "";
	}

    @Test
	@DisplayName("Excluir todos os perfis")
	@Order(1)
	void deleteAllAdmProfile() throws Exception {
		service.restartSequence();
		
		this.mvc.perform(delete(URL + "/deleteAll")
			.with(bearerTokenFor(username))
		)
		.andExpect(status().isOk());
	}

    @Test
	@DisplayName("Incluir vários perfis")
	@Order(2)
	void insertManyAdmProfile() throws Exception {
		this.mvc.perform(post(URL + "/saveMany")
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(getAdmProfileJson()))
		.andExpect(status().isCreated());
	}

    @Test
	@DisplayName("Consultar UM perfil")
	@Order(3)
	void getAdmProfile() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.param("description", "Administrador")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[:1].description").value("Administrador"))
			.andExpect(content().string(containsString("/admin/admParameterCategory")))
            .andReturn();

        String resultado = result.getResponse().getContentAsString();
        boolean contem = resultado.contains("/admin/admParameterCategory");

        if (contem) {
            JsonArray convertedObject = new Gson().fromJson(resultado, JsonArray.class);
            JsonObject obj = convertedObject.get(0).getAsJsonObject();
            idUpdate = obj.get("id").getAsString();	
        }

        assertTrue(contem);	    
    }

	@Test
	@DisplayName("Alterar UM perfil")
	@Order(4)
	void updateAdmPage() throws Exception {
        String dados = getDados(0).replaceFirst("Administrador", "ALTERADOR Administrador");
		this.mvc.perform(put(URL + "/" + idUpdate)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(dados))
		.andExpect(status().isOk());
	}

}
