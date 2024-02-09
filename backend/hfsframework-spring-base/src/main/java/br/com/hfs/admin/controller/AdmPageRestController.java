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

import br.com.hfs.admin.controller.dto.AdmPageDTO;
import br.com.hfs.admin.controller.dto.ParamDTO;
import br.com.hfs.admin.controller.form.AdmPageForm;
import br.com.hfs.admin.model.AdmPage;
import br.com.hfs.admin.service.AdmPageService;
import br.com.hfs.base.report.BaseViewReportController;
import br.com.hfs.base.report.ReportParamsDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/admPage")
public class AdmPageRestController extends BaseViewReportController {
	
	private static final long serialVersionUID = 1L;

	@Autowired
	private AdmPageService admPageService;

	@GetMapping("/paged")
	@Cacheable(value = "admPageControllerList")
	public Page<AdmPageDTO> listPaged(@RequestParam(required = false) String description, 
			@PageableDefault(page = 0, size = 20, direction = Direction.ASC, sort = "id") Pageable pagination) {
		//@RequestParam int page, @RequestParam int size, @RequestParam String fieldToSort) {
	
		//Pageable pagination = PageRequest.of(page, size, Direction.ASC, fieldToSort);
		
		if (description == null) {
			Page<AdmPage> pages = admPageService.findAll(pagination);
			return AdmPageDTO.convert(pages);
		} else {
			Page<AdmPage> pages = admPageService.findByDescriptionLike(description + "%", pagination);
			return AdmPageDTO.convert(pages);
		}
	}
	
	@GetMapping()
	@Cacheable(value = "admPageControllerList")
	public List<AdmPageDTO> listAll(@RequestParam(required = false) String description) {		
		if (description == null) {
			List<AdmPage> pages = admPageService.findAll();
			return AdmPageDTO.convert(pages);
		} else {
			List<AdmPage> pages = admPageService.findByDescriptionLike(description + "%");
			return AdmPageDTO.convert(pages);
		}
	}
	
	@PostMapping
	@CacheEvict(value = "admPageControllerList", allEntries = true)
	public ResponseEntity<AdmPageDTO> save(@RequestBody @Valid AdmPageForm form, UriComponentsBuilder uriBuilder) {
		AdmPage obj = form.convert();
		admPageService.insert(obj);

		Optional<AdmPage> bean = admPageService.findById(obj.getId());
		if (bean.isPresent()) {
			URI uri = uriBuilder.path("/admPage/{id}").buildAndExpand(bean.get().getId()).toUri();
			return ResponseEntity.created(uri).body(new AdmPageDTO(bean.get()));
		}
		return ResponseEntity.notFound().build();
	}

	@GetMapping("{id}")
	public ResponseEntity<AdmPageDTO> get(@PathVariable Long id) {
		Optional<AdmPage> bean = admPageService.findById(id);
		if (bean.isPresent()) {
			return ResponseEntity.ok(new AdmPageDTO(bean.get()));
		}
		return ResponseEntity.notFound().build();
	}
	
	@PutMapping("{id}")
	@CacheEvict(value = "admPageControllerList", allEntries = true)
	public ResponseEntity<AdmPageDTO> update(@PathVariable Long id, @RequestBody @Valid AdmPageForm form){
		Optional<AdmPage> bean = form.update(id, admPageService);
		if (bean.isPresent()) {
			admPageService.update(bean.get());

			Optional<AdmPage> updated = admPageService.findById(bean.get().getId());
			if (updated.isPresent()) {
				return ResponseEntity.ok(new AdmPageDTO(updated.get()));
			}
		}
		return ResponseEntity.notFound().build();
	}
	
	@DeleteMapping("{id}")
	@CacheEvict(value = "admPageControllerList", allEntries = true)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		Optional<AdmPage> bean = admPageService.findById(id);
		if (bean.isPresent()) {
			admPageService.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}
	
	@DeleteMapping("/deleteMany")
	public ResponseEntity<?> deleteMany(@RequestBody List<Long> listaId){
		Long listaBean = admPageService.countMany(listaId);
		if (listaBean > 0) {
			admPageService.deleteAllById(listaId);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

	@DeleteMapping("/deleteAll")
	public ResponseEntity<?> deleteAll(){
		admPageService.deleteAll();
		return ResponseEntity.ok().build();
	}

	//@ApiOperation("Export Report")
	@PostMapping(value = "/report", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ByteArrayResource> report(HttpServletRequest request, @RequestBody ReportParamsDTO reportParamsDTO) {
		reportParamsDTO.getParams().add(new ParamDTO("PARAMETER1", ""));
		reportParamsDTO.setReportName("AdmPage");
		return exportReport(reportParamsDTO, admPageService.findAll());
	}	
	
	@PostMapping("/saveMany")
	public ResponseEntity<?> saveMany(@RequestBody List<AdmPageForm> formMany) {
		List<AdmPage> obj = new ArrayList<>();

		for (AdmPageForm form : formMany) {
			obj.add(form.convert());
		}

		admPageService.insert(obj);
		
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

}
