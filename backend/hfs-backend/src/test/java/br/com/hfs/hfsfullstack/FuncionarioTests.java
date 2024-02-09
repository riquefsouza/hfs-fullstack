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
                "nome" : "JOSE SABA FILHO",
                "cpf" : 58047239872,
                "email" : "jose.saba@trt1.jus.br",
                "telefone" : "2235-0505",
				"celular" : "99983-0505",
				"setor" : "APOSENT",
				"codCargo" : 1724,
				"cargo" : "JUIZ TITULAR DE VARA DO TRABALHO",
				"dataAdmissao" : "1993-11-16T03:00:00.000Z",
				"dataSaida" : null,		
                "ativo" : true
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
		boolean doesContain = stringResult.contains("jose.saba@trt1.jus.br");
		assertTrue(doesContain);	
	}

	@Test
	@DisplayName("Consultar UM funcionario")
	@Order(4)
	void getFuncionario() throws Exception {
		MvcResult result = this.mvc.perform(get(URL)
			.param("nome", "JOSE")
			.with(bearerTokenFor(username)))
			.andExpect(status().isOk())
			.andReturn();

		String resultado = result.getResponse().getContentAsString();
		boolean contem = resultado.contains("JOSE SABA FILHO");

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
                    "nome" : "JOSE SABA ALTERADO FILHO",
                    "cpf" : 58047239872,
                    "email" : "jose.saba@trt1.jus.br",
                    "telefone" : "2235-0505",
					"celular" : "99983-0505",
					"setor" : "APOSENT",
					"codCargo" : 1724,
					"cargo" : "JUIZ TITULAR DE VARA DO TRABALHO",
					"dataAdmissao" : "1993-11-16T03:00:00.000Z",
					"dataSaida" : null,			
                    "ativo" : false
                }                    
            """, idUpdate)
            ))
		.andExpect(status().isOk());
	}

}
