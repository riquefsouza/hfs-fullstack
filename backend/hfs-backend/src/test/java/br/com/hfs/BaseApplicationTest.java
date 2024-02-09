package br.com.hfs;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.keycloak.admin.client.Keycloak;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

public class BaseApplicationTest {

    @Value("${keycloak.host}")
    protected String keycloakHost;

    @Value("${keycloak.realm}")
    protected String keycloakRealm;

    @Value("${keycloak.client}")
    protected String keycloakClient;

	//@Value("classpath:data/adm_parameter_category.json")
	//protected Resource admParameterCategoryResource;

	protected String username = "admin";

	/*
	@AfterAll
	public static void cleanUp() throws Exception {
		deleteRealm("admin", "admin", "quickstart");
	}

	@BeforeAll
	public static void onBeforeClass() {
		try {
			importTestRealm("admin", "admin", "/realm-import.json");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test
	public void whenResourceAsFile_thenReadSuccessful() throws IOException {	
		File resource = admParameterCategoryResource.getFile();
		//List<String> allLines = Files.readAllLines(resource.toPath());
		//assertTrue(allLines.contains("System Parameters"));
		//assertTrue(allLines.stream().anyMatch(s -> s.equals("System Parameters")));

		String json = new String(Files.readAllBytes(resource.toPath()));
        JsonArray convertedObject = new Gson().fromJson(json, JsonArray.class);
		assertTrue(convertedObject.isJsonArray());

        JsonObject obj = convertedObject.get(0).getAsJsonObject();        
        assertEquals("Login Parameters", obj.get("description").getAsString());
	}	

 */

	protected static String getAdmParameterCategoryJson() {	
		String json = "";
		try {
			//File resource = admParameterCategoryResource.getFile();
			File resource = new ClassPathResource("data/adm_parameter_category.json").getFile();
			json = new String(Files.readAllBytes(resource.toPath()));			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return json;
	}

	protected static String getAdmParameterJson() {	
		String json = "";
		try {
			//File resource = admParameterResource.getFile();
			File resource = new ClassPathResource("data/adm_parameter.json").getFile();
			json = new String(Files.readAllBytes(resource.toPath()));			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return json;
	}

	protected static String getAdmPageJson() {	
		String json = "";
		try {
			File resource = new ClassPathResource("data/adm_page.json").getFile();
			json = new String(Files.readAllBytes(resource.toPath()));			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return json;
	}

	protected static String getAdmProfileJson() {	
		String json = "";
		try {
			File resource = new ClassPathResource("data/adm_profile.json").getFile();
			json = new String(Files.readAllBytes(resource.toPath()));			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return json;
	}

	protected static String getAdmMenuJson() {	
		String json = "";
		try {
			File resource = new ClassPathResource("data/adm_menu.json").getFile();
			json = new String(Files.readAllBytes(resource.toPath()));			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return json;
	}

 	protected RequestPostProcessor bearerTokenFor(String username) {
		String token = getToken(username, username);

		return new RequestPostProcessor() {
			@Override
			public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
				request.addHeader("Authorization", "Bearer " + token);
				return request;
			}
		};
	}

	public String getToken(String username, String password) {
		Keycloak keycloak = Keycloak.getInstance(
			keycloakHost,
			keycloakRealm,
			username,
			password,
			keycloakClient);
		return keycloak.tokenManager().getAccessTokenString();
	}

}
