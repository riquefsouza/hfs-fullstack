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

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
public class FuncionarioTests extends BaseApplicationTest {

    @Autowired
	protected MockMvc mvc;

    private static final String URL = "/funcionario";

    private static String dados;

    private static String idUpdate;
   
    @BeforeAll
	public static void onBeforeClass() {
		dados = 
		"""
			{
				"id": 93203,
				"nome": "HENRIQUE FIGUEIREDO DE SOUZA",
				"cpf": 94216074065,
				"email": "temp@temp.com.br",
				"telefone": "3204-7825",
				"celular": "29264-1934",
				"setor": "TEMP",
				"codCargo": 15426,
				"cargo": "ANALISTA TECNO INFORMACAO",
				"dataAdmissao": "2014-03-17",
				"dataSaida": null,
				"ativo": true,
				"cpfFormatado": "942.160.740-65",
				"dataAdmissaoFormatada": "17/03/2014",
				"dataSaidaFormatada": ""
			}
        """;
	}

	@Test
	@DisplayName("Excluir todos os funcionários")
	@Order(1)
	void deleteAllFuncionario() throws Exception {
		this.mvc.perform(delete(URL + "/deleteAll")
			.with(bearerTokenFor(username))
		)
		.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Incluir um funcionário")
	@Order(2)
	void insertFuncionario() throws Exception {
		this.mvc.perform(post(URL)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(dados))
		.andExpect(status().isCreated());
	}

	@Test
	@DisplayName("Consultar todos os funcionários")
	@Order(3)
	void findAllFuncionarios() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andReturn();

		String stringResult = result.getResponse().getContentAsString();
		boolean doesContain = stringResult.contains("temp@temp.com.br");
		assertTrue(doesContain);	
	}

	@Test
	@DisplayName("Consultar UM funcionario")
	@Order(4)
	void getFuncionario() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.param("nome", "HENRIQUE")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andReturn();

		String resultado = result.getResponse().getContentAsString();
		boolean contem = resultado.contains("HENRIQUE FIGUEIREDO DE SOUZA");

		if (contem) {
			JsonArray convertedObject = new Gson().fromJson(resultado, JsonArray.class);
			JsonObject obj = convertedObject.get(0).getAsJsonObject();
			idUpdate = obj.get("id").getAsString();	
		}

		assertTrue(contem);	
	}

	@Test
	@DisplayName("Alterar UM funcionario")
	@Order(5)
	void updateFuncionario() throws Exception {
		this.mvc.perform(put(URL + "/" + idUpdate)
			.with(bearerTokenFor(username))
			.contentType(MediaType.APPLICATION_JSON)
			.content(
                String.format("""
                {
                    "id" : %s,
					"nome": "HENRIQUE ALTERADO FIGUEIREDO DE SOUZA",
					"cpf": 94216074065,
					"email": "temp@temp.com.br",
					"telefone": "3204-7825",
					"celular": "29264-1934",
					"setor": "TEMP",
					"codCargo": 15426,
					"cargo": "ANALISTA TECNO INFORMACAO",
					"dataAdmissao": "2014-03-17",
					"dataSaida": null,
					"ativo": true,
                }                    
            """, idUpdate)
            ))
		.andExpect(status().isOk());
	}

}
