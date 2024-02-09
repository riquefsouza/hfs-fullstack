package br.com.hfs.hfsfullstack.controller;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.hfs.hfsfullstack.model.Funcionario;
import br.com.hfs.util.CPFCNPJUtil;
import br.com.hfs.util.DateUtil;

public record FuncionarioResponse(
    @JsonProperty("id") Long id,
    @JsonProperty("nome") String nome, 
    @JsonProperty("cpf") Long cpf, 
    @JsonProperty("email") String email, 
    @JsonProperty("telefone") String telefone, 
    @JsonProperty("celular") String celular,
    @JsonProperty("setor") String setor,
    @JsonProperty("codCargo") Long codCargo,
    @JsonProperty("cargo") String cargo,
    @JsonProperty("dataAdmissao") Date dataAdmissao,
    @JsonProperty("dataSaida") Date dataSaida,
    @JsonProperty("ativo") Boolean ativo,
    @JsonProperty("cpfFormatado") String cpfFormatado,
    @JsonProperty("dataAdmissaoFormatada") String dataAdmissaoFormatada,
	@JsonProperty("dataSaidaFormatada") String dataSaidaFormatada
) {

    public static FuncionarioResponse from(final Funcionario funcionario) {
        return new FuncionarioResponse(
            funcionario.getId(),
            funcionario.getNome(),
            funcionario.getCpf(),
            funcionario.getEmail(),
            funcionario.getTelefone(),
            funcionario.getCelular(),
            funcionario.getSetor(),
            funcionario.getCodCargo(),
            funcionario.getCargo(),
            funcionario.getDataAdmissao(),
            funcionario.getDataSaida(),
            funcionario.getAtivo().equals('S'),
            CPFCNPJUtil.formatCPForCPNJ(funcionario.getCpf()),
            DateUtil.Format(funcionario.getDataAdmissao(),DateUtil.DATE_STANDARD),
            DateUtil.Format(funcionario.getDataSaida(),DateUtil.DATE_STANDARD)
            );
    }

    public static List<FuncionarioResponse> from(List<Funcionario> funcionarios) {
        return funcionarios.stream().map(model -> {
            FuncionarioResponse resp = new FuncionarioResponse(
                model.getId(), model.getNome(), model.getCpf(), 
                model.getEmail(), model.getTelefone(),
                model.getCelular(),
                model.getSetor(),
                model.getCodCargo(),
                model.getCargo(),
                model.getDataAdmissao(),
                model.getDataSaida(),
                model.getAtivo().equals('S'),
                CPFCNPJUtil.formatCPForCPNJ(model.getCpf()),
                DateUtil.Format(model.getDataAdmissao(),DateUtil.DATE_STANDARD),
                DateUtil.Format(model.getDataSaida(),DateUtil.DATE_STANDARD));
            return resp;
        }).collect(Collectors.toList());
    }    

    public static Page<FuncionarioResponse> from(Page<Funcionario> pg) {
        return pg.map(model -> {
            FuncionarioResponse resp = new FuncionarioResponse(
                model.getId(), model.getNome(), model.getCpf(), 
                model.getEmail(), model.getTelefone(), 
                model.getCelular(),
                model.getSetor(),
                model.getCodCargo(),
                model.getCargo(),
                model.getDataAdmissao(),
                model.getDataSaida(),
                model.getAtivo().equals('S'),
                CPFCNPJUtil.formatCPForCPNJ(model.getCpf()),
                DateUtil.Format(model.getDataAdmissao(),DateUtil.DATE_STANDARD),
                DateUtil.Format(model.getDataSaida(),DateUtil.DATE_STANDARD));
            return resp;
        });
    }    

    public Funcionario toModel() {        
        return Funcionario.with(
            id(),
            nome(),
            cpf(),
            email(),
            telefone(),
            celular(),
            setor(),
            codCargo(),
            cargo(),
            dataAdmissao(),
            dataSaida(),
            ativo().equals('S')          
        );
    }    

}