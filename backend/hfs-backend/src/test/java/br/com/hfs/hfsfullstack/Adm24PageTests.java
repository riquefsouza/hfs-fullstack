package br.com.hfs.hfsfullstack;

import static org.hamcrest.Matchers.containsString;
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
import br.com.hfs.admin.service.AdmPageService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm24PageTests extends BaseApplicationTest {
	
    @Autowired
	protected MockMvc mvc;

	private static final String URL = "/admPage";
     
    private static String idUpdate = "";

	@Autowired
	private AdmPageService service;

	private String getDados(int ordem) {
        String dados = getAdmPageJson();

        JsonArray convertedObject = new Gson().fromJson(dados, JsonArray.class);

        if (convertedObject.isJsonArray()){
            //JsonObject obj = convertedObject.get(ordem).getAsJsonObject();
            //idUpdate = obj.get("id").getAsString();

            return convertedObject.get(ordem).toString();
        }

		return "";
	}

    @Test
	@DisplayName("Excluir todas as páginas")
	@Order(1)
	void deleteAllAdmPage() throws Exception {
		this.mvc.perform(delete(URL + "/deleteAll")
			.with(bearerTokenFor(username))
		)
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Incluir UMA página")
	@Order(2)
	void insertAdmPage() throws Exception {
		this.mvc.perform(post(URL)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(getDados(1)))
		.andExpect(status().isCreated());
	}

    @Test
	@DisplayName("Consultar todas as páginas")
	@Order(3)
	void findAllAdmPage() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andReturn();

		String stringResult = result.getResponse().getContentAsString();
		boolean doesContain = stringResult.contains("/admin/admParameter");
		assertTrue(doesContain);	
	}

	@Test
	@DisplayName("Consultar UMA página")
	@Order(4)
	void getAdmPage() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.param("description", "Parâmetros")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$[:1].description").value("Parâmetros"))
			.andExpect(content().string(containsString("/admin/admParameter")))
            .andReturn();

        String resultado = result.getResponse().getContentAsString();
        boolean contem = resultado.contains("/admin/admParameter");

        if (contem) {
            JsonArray convertedObject = new Gson().fromJson(resultado, JsonArray.class);
            JsonObject obj = convertedObject.get(0).getAsJsonObject();
            idUpdate = obj.get("id").getAsString();	
        }

        assertTrue(contem);	    
	}

	@Test
	@DisplayName("Alterar UMA página")
	@Order(5)
	void updateAdmPage() throws Exception {
        String dados = getDados(1).replaceFirst("Parâmetros", "ALTERADOR Parâmetros");
		this.mvc.perform(put(URL + "/" + idUpdate)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(dados))
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Excluir todas as páginas e Incluir todas as páginas")
	@Order(6)
	void InsertManyAdmPage() throws Exception {
		service.restartSequence();
		
		this.mvc.perform(delete(URL + "/deleteAll")
			.with(bearerTokenFor(username))
		)
		.andExpect(status().isOk());

		this.mvc.perform(post(URL + "/saveMany")
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(getAdmPageJson()))
		.andExpect(status().isCreated());

	}

}
