package br.com.hfs.hfsfullstack;

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
import br.com.hfs.admin.model.AdmParameterCategory;
import br.com.hfs.admin.service.AdmParameterCategoryService;
import br.com.hfs.admin.service.AdmParameterService;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class Adm23ParameterTests extends BaseApplicationTest {
	
    @Autowired
	protected MockMvc mvc;

	private static final String URL = "/admParameter";

	@Autowired
	private AdmParameterCategoryService admParameterCategoryService;

	@Autowired
	private AdmParameterService service;

	private static String idUpdate;

	private String getDados(String alterar) {
		String dados = "";
		List<AdmParameterCategory> categorias = admParameterCategoryService.findByDescriptionLike("E-mail Parameters");

		if (!categorias.isEmpty()) {
			dados = 
			String.format("""
			{
				"id" : 1,
				"code" : "BLOQUEAR_LOGIN",
				"description" : "Bloquear o sistema %s para que os usuários, exceto do administador, não façam login",				
				"value" : "false",
				"admParameterCategory" : { "id": %s, "description" : "%s", "order" : %s }
			}	
			""", 
			alterar, 
			categorias.get(0).getId().toString(), 
			categorias.get(0).getDescription(), 
			categorias.get(0).getOrder().toString());	
		}

		return dados;
	}

	@Test
	@DisplayName("Excluir todos os parâmetros")
	@Order(1)
	void deleteAllAdmParameter() throws Exception {
		service.restartSequence();

		this.mvc.perform(delete(URL + "/deleteAll")
			.with(bearerTokenFor(username))
		)
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Incluir vários parâmetros")
	@Order(2)
	void insertAdmParameter() throws Exception {
		this.mvc.perform(post(URL + "/saveMany")
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(getAdmParameterJson()))
		.andExpect(status().isCreated());
	}

	@Test
	@DisplayName("Consultar todos os parâmetros")
	@Order(3)
	void findAllAdmParameter() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andReturn();

		String stringResult = result.getResponse().getContentAsString();
		boolean doesContain = stringResult.contains("BLOQUEAR_LOGIN");
		assertTrue(doesContain);	
	}

	@Test
	@DisplayName("Consultar UM parâmetro")
	@Order(4)
	void getAdmParameter() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.param("description", "Bloquear o sistema")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			//.andExpect(jsonPath("$[:1].description", containsString("Bloquear o sistema")))
			//.andExpect(content().string(containsString("Bloquear o sistema")));
			.andReturn();

		String resultado = result.getResponse().getContentAsString();
		boolean contem = resultado.contains("Bloquear o sistema");

		if (contem) {
			JsonArray convertedObject = new Gson().fromJson(resultado, JsonArray.class);
			JsonObject obj = convertedObject.get(0).getAsJsonObject();
			idUpdate = obj.get("id").getAsString();	
		}

		assertTrue(contem);	
	}

	@Test
	@DisplayName("Alterar UM parâmetro")
	@Order(5)
	void updateAdmParameter() throws Exception {
		this.mvc.perform(put(URL + "/" + idUpdate)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(getDados("ALTERADO")))
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Consultar PAGINADO parâmetros")
	@Order(6)
	void getPaginadoAdmParameter() throws Exception {
		this.mvc.perform(get(URL + "/paged")
			.param("page", "0")
			.param("size", "5")
			.param("sort", "description,desc")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.content[:1].code").value("SMTP_USERNAME"))
			.andExpect(jsonPath("$.numberOfElements").value(5));
	}

}
