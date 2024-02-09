package br.com.hfs.hfsfullstack.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import br.com.hfs.hfsfullstack.model.Funcionario;
import br.com.hfs.hfsfullstack.service.FuncionarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/funcionario")
public class FuncionarioController implements FuncionarioAPI {

    @Autowired
    protected FuncionarioService service;

    @GetMapping()
    public List<FuncionarioResponse> listAll(@RequestParam(required = false) String nome) {
        if (nome == null) {
            List<Funcionario> objList = service.findAll();
            return FuncionarioResponse.from(objList);
        } else {
            List<Funcionario> objList = service.findByNomeLike(nome + "%");
            return FuncionarioResponse.from(objList);
        }
    }

    @GetMapping("/paged")
    public Page<FuncionarioResponse> listPaged(@RequestParam(required = false) String nome,
                                          @PageableDefault(page = 0, size = 20,
                                                  direction = Sort.Direction.ASC,
                                                  sort = "id") Pageable pagination) {

        if (nome == null) {
            Page<Funcionario> obj = service.findAll(pagination);
            return FuncionarioResponse.from(obj);
        } else {
            Page<Funcionario> obj = service.findByNomeLike(nome + "%", pagination);
            return FuncionarioResponse.from(obj);
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<FuncionarioResponse> save(@RequestBody @Valid FuncionarioRequest form, UriComponentsBuilder uriBuilder) {
        Funcionario obj = form.toModel();
        obj = service.insert(obj);

        URI uri = uriBuilder.path("funcionario/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(FuncionarioResponse.from(obj));
    }

    @GetMapping("{id}")
    public ResponseEntity<FuncionarioResponse> get(@PathVariable Long id) {
        Optional<Funcionario> bean = service.findById(id);
        if (bean.isPresent()) {
            return ResponseEntity.ok(FuncionarioResponse.from(bean.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("{id}")
    @Transactional
    public ResponseEntity<FuncionarioResponse> update(@PathVariable Long id, @RequestBody @Valid FuncionarioRequest form){
        Optional<Funcionario> bean = service.findById(id);		
		if (bean.isPresent()) {
			Funcionario funcionario = service.update(form.toModel(id));			
			return ResponseEntity.ok(FuncionarioResponse.from(funcionario));
		}
		return ResponseEntity.notFound().build();
    }

    @DeleteMapping("{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Funcionario> bean = service.findById(id);
        if (bean.isPresent()) {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

	@DeleteMapping("/deleteMany")
	public ResponseEntity<?> deleteMany(@RequestBody List<Long> listaId){
		Long listaBean = service.countMany(listaId);
		if (listaBean > 0) {
			service.deleteAllById(listaId);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<?> deleteAll(){
		service.deleteAll();
		return ResponseEntity.ok().build();
	}

}
