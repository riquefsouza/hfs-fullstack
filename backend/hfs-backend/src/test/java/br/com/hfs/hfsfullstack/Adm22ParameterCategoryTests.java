package br.com.hfs.hfsfullstack;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
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
import br.com.hfs.admin.service.AdmParameterCategoryService;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm22ParameterCategoryTests extends BaseApplicationTest {
	
    @Autowired
	protected MockMvc mvc;

	private static final String URL = "/admParameterCategory";

	private static String dados;

	private static String idUpdate;

	@Autowired
	private AdmParameterCategoryService service;

	@BeforeAll
	public static void onBeforeClass() {
		/*
		dados = 
		"""
			[
				{ "description" : "Login Parameters", "order" : 2 },
				{ "description" : "E-mail Parameters", "order" : 3 },
				{ "description" : "Network connection Parameters", "order" : 4 },
				{ "description" : "System Parameters", "order" : null }
			]					
		""";
		 */

		 dados = getAdmParameterCategoryJson();
	}

	@Test
	@DisplayName("Testa um Token Válido")
	@Order(1)
	void valid_BearerToken() throws Exception {
		this.mvc.perform(get("/")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Hello, admin!")));
	}

	@Test
	@DisplayName("Testa um Token Inválido")
	@Order(2)
	void invalid_BearerToken() throws Exception {
		this.mvc.perform(get("/"))
		.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Excluir todas as categorias dos parâmetros")
	@Order(3)
	void deleteAllAdmCategoryParameter() throws Exception {
		service.restartSequence();

		this.mvc.perform(delete(URL + "/deleteAll")
			.with(bearerTokenFor(username))
		)
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Incluir várias categorias dos parâmetros")
	@Order(4)
	void insertManyAdmCategoryParameter() throws Exception {
		this.mvc.perform(post(URL + "/saveMany")
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(dados))
		.andExpect(status().isCreated());
	}

	@Test
	@DisplayName("Consultar todas as categorias de parâmetro")
	@Order(5)
	void findAllAdmCategoryParameter() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andReturn();

		String stringResult = result.getResponse().getContentAsString();
		boolean doesContain = stringResult.contains("Network connection Parameters");
		assertTrue(doesContain);	
	}

	@Test
	@DisplayName("Consultar UMA categoria de parâmetro")
	@Order(6)
	void getAdmCategoryParameter() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.param("description", "Network")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			//.andExpect(content().string(containsString("Network")));
			.andReturn();

		String resultado = result.getResponse().getContentAsString();
		boolean contem = resultado.contains("Network connection Parameters");

		if (contem) {
			JsonArray convertedObject = new Gson().fromJson(resultado, JsonArray.class);
			JsonObject obj = convertedObject.get(0).getAsJsonObject();
			idUpdate = obj.get("id").getAsString();	
		}

		assertTrue(contem);	
	}

	@Test
	@DisplayName("Alterar UMA categoria da parâmetro")
	@Order(7)
	void updateAdmCategoryParameter() throws Exception {
		this.mvc.perform(put(URL + "/" + idUpdate)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content("{ \"id\": " + idUpdate + ", \"description\" : \"Network ALTERADO connection Parameters\", \"order\" : 4000 }"))
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Consultar PAGINADO categorias de parâmetros")
	@Order(8)
	void getPaginadoAdmCategoryParameter() throws Exception {
		this.mvc.perform(get(URL + "/paged")
			.param("page", "0")
			.param("size", "5")
			.param("sort", "description,desc")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content[:1].description").value("System Parameters"))
			.andExpect(jsonPath("$.numberOfElements").value(4));
	}

}
