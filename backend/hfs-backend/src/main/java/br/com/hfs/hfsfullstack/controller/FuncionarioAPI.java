package br.com.hfs.hfsfullstack.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.util.UriComponentsBuilder;

import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RequestMapping("/funcionario")
@Tag(name = "Funcionario")
public interface FuncionarioAPI {
 
    @GetMapping
    @Operation(summary = "Lista todos os funcionários sem paginação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado com sucesso"),
            @ApiResponse(responseCode = "422", description = "Um parâmetro inválido foi recebido"),
            @ApiResponse(responseCode = "500", description = "Um erro interno do servidor foi gerado"),
    })
    public List<FuncionarioResponse> listAll(@RequestParam(required = false) String nome);

    @GetMapping("/paged")
    @Operation(summary = "Lista todos os funcionários paginados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Listado com sucesso"),
            @ApiResponse(responseCode = "422", description = "Um parâmetro inválido foi recebido"),
            @ApiResponse(responseCode = "500", description = "Um erro interno do servidor foi gerado"),
    })
    public Page<FuncionarioResponse> listPaged(@RequestParam(required = false) String nome,
                                          @PageableDefault(page = 0, size = 20,
                                                  direction = Sort.Direction.ASC,
                                                  sort = "id") Pageable pagination);

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Cria um novo funcionário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Criado com sucesso"),
            @ApiResponse(responseCode = "422", description = "Um erro de validação foi lançado"),
            @ApiResponse(responseCode = "500", description = "Um erro interno do servidor foi gerado"),
    })                                                  
    public ResponseEntity<FuncionarioResponse> save(@RequestBody @Valid FuncionarioRequest form, 
        UriComponentsBuilder uriBuilder);

    @GetMapping(
            value = "{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Obtem um funcionário pelo seu identificador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Funcionário recuperado com sucesso"),
            @ApiResponse(responseCode = "404", description = "O funcionário não foi encontrado"),
            @ApiResponse(responseCode = "500", description = "Um erro interno do servidor foi gerado"),
    })
    public ResponseEntity<FuncionarioResponse> get(@PathVariable Long id);

    @PutMapping(
            value = "{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Atualizar um funcionário pelo seu identificador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Funcionário atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "O funcionário não foi encontrado"),
            @ApiResponse(responseCode = "500", description = "Um erro interno do servidor foi gerado"),
    })
    public ResponseEntity<FuncionarioResponse> update(@PathVariable Long id, 
        @RequestBody @Valid FuncionarioRequest form);

    @DeleteMapping(value = "{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclue um funcionário pelo seu identificador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Funcionário excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "O funcionário não foi encontrado"),
            @ApiResponse(responseCode = "500", description = "Um erro interno do servidor foi gerado"),
    })
    public ResponseEntity<?> delete(@PathVariable Long id);
}
