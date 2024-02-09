package br.com.hfs.hfsfullstack.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.hfs.hfsfullstack.model.Funcionario;

import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    Page<Funcionario> findByNomeLike(String nome, Pageable pagination);

    List<Funcionario> findByNomeLike(String nome);
}
