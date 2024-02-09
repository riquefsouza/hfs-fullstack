package br.com.hfs.admin.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import br.com.hfs.admin.controller.dto.AdmMenuDTO;
import br.com.hfs.admin.controller.dto.ParamDTO;
import br.com.hfs.admin.controller.form.AdmMenuForm;
import br.com.hfs.admin.model.AdmMenu;
import br.com.hfs.admin.service.AdmMenuService;
import br.com.hfs.base.report.BaseViewReportController;
import br.com.hfs.base.report.ReportParamsDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/admMenu")
public class AdmMenuRestController extends BaseViewReportController {
	
	private static final long serialVersionUID = 1L;

	@Autowired
	private AdmMenuService admMenuService;

	@GetMapping("/paged")
	@Cacheable(value = "admMenuControllerList")
	public Page<AdmMenuDTO> listPaged(@RequestParam(required = false) String description, 
			@PageableDefault(page = 0, size = 20, direction = Direction.ASC, sort = "id") Pageable pagination) {
		//@RequestParam int page, @RequestParam int size, @RequestParam String fieldToSort) {
	
		//Pageable pagination = PageRequest.of(page, size, Direction.ASC, fieldToSort);
		
		if (description == null) {
			Page<AdmMenu> objList = admMenuService.findAll(pagination);
			return AdmMenuDTO.convert(objList);
		} else {
			Page<AdmMenu> objList = admMenuService.findByDescriptionLike(description + "%", pagination);
			return AdmMenuDTO.convert(objList);
		}
	}
	
	@GetMapping()
	@Cacheable(value = "admMenuControllerList")
	public List<AdmMenuDTO> listAll(@RequestParam(required = false) String description) {		
		if (description == null) {
			List<AdmMenu> objList = admMenuService.findAll();
			return AdmMenuDTO.convert(objList);
		} else {
			List<AdmMenu> objList = admMenuService.findByDescriptionLike(description + "%");
			return AdmMenuDTO.convert(objList);
		}
	}
	
	@PostMapping
	@CacheEvict(value = "admMenuControllerList", allEntries = true)
	public ResponseEntity<AdmMenuDTO> save(@RequestBody @Valid AdmMenuForm form, UriComponentsBuilder uriBuilder) {
		AdmMenu obj = form.convert();
		admMenuService.insert(obj);		
		
		Optional<AdmMenu> bean = admMenuService.getMenuById(obj.getId());
		if (bean.isPresent()) {
			URI uri = uriBuilder.path("/admMenu/{id}").buildAndExpand(bean.get().getId()).toUri();
			return ResponseEntity.created(uri).body(new AdmMenuDTO(bean.get()));
		}
		return ResponseEntity.notFound().build();
	}

	@GetMapping("{id}")
	public ResponseEntity<AdmMenuDTO> get(@PathVariable Long id) {
		Optional<AdmMenu> bean = admMenuService.getMenuById(id);
		if (bean.isPresent()) {
			return ResponseEntity.ok(new AdmMenuDTO(bean.get()));
		}
		return ResponseEntity.notFound().build();
	}
	
	@PutMapping("{id}")
	@CacheEvict(value = "admMenuControllerList", allEntries = true)
	public ResponseEntity<AdmMenuDTO> update(@PathVariable Long id, @RequestBody @Valid AdmMenuForm form){
		Optional<AdmMenu> bean = form.update(id, admMenuService);
		if (bean.isPresent()) {
			//AdmMenu menu = admMenuService.update(bean.get());
			admMenuService.updateMenu(
				bean.get().getDescription(),
				bean.get().getIdMenuParent(),
				bean.get().getIdPage(),
				bean.get().getOrder(),
				bean.get().getId()
			);

			Optional<AdmMenu> updated = admMenuService.getMenuById(bean.get().getId());
			if (updated.isPresent()) {
				return ResponseEntity.ok(new AdmMenuDTO(updated.get()));
			}
		}
		return ResponseEntity.notFound().build();
	}
	
	@DeleteMapping("{id}")
	@CacheEvict(value = "admMenuControllerList", allEntries = true)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		Optional<AdmMenu> bean = admMenuService.getMenuById(id);
		if (bean.isPresent()) {
			//admMenuService.deleteById(id);
			//admMenuService.deleteMenu(id);
			admMenuService.deleteWithChildrens(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}
	
	@DeleteMapping("/deleteMany")
	public ResponseEntity<?> deleteMany(@RequestBody List<Long> listaId){
		Long listaBean = admMenuService.countMany(listaId);
		if (listaBean > 0) {
			admMenuService.deleteAllById(listaId);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<?> deleteAll(){
		admMenuService.deleteAll();
		return ResponseEntity.ok().build();
	}

	//@ApiOperation("Export Report")
	@PostMapping(value = "/report", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ByteArrayResource> report(HttpServletRequest request, @RequestBody ReportParamsDTO reportParamsDTO) {
		reportParamsDTO.getParams().add(new ParamDTO("PARAMETER1", ""));
		reportParamsDTO.setReportName("AdmMenu");
		return exportReport(reportParamsDTO, admMenuService.findAll());
	}
	
	@PostMapping("/saveMany")
	public ResponseEntity<?> saveMany(@RequestBody List<AdmMenuForm> formMany) {
		List<AdmMenu> obj = new ArrayList<>();

		for (AdmMenuForm form : formMany) {
			obj.add(form.convert());
		}

		admMenuService.insert(obj);
		
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

}
