package br.com.hfs.hfsfullstack.controller;

import java.util.Date;

import br.com.hfs.hfsfullstack.model.Funcionario;
import br.com.hfs.util.CPFCNPJUtil;
import br.com.hfs.util.DateUtil;

public record FuncionarioRequest(
    String nome, 
    Long cpf, 
    String email, 
    String telefone, 
    String celular,
    String setor,
    Long codCargo,
    String cargo,
    Date dataAdmissao,
    Date dataSaida,
    Boolean ativo
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

    public Funcionario toModel(Long id) {
        return Funcionario.with(
            id,
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
            ativo()
        );
    }    

    public Funcionario toModel() {
        return toModel(null);
    }    
}
