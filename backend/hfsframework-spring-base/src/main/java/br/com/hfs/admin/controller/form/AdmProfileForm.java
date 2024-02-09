package br.com.hfs.admin.controller.form;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import br.com.hfs.admin.model.AdmPage;
import br.com.hfs.admin.model.AdmProfile;
import br.com.hfs.admin.service.AdmProfileService;

public class AdmProfileForm {

	private Long id;
	
	private Boolean administrator;

	private String description;

	private Boolean general;
	
	private List<AdmPageForm> admPages;

	public AdmProfileForm() {
		super();
	}
	
	public AdmProfileForm(Long id) {
		super();
		this.id = id;
	}

	public AdmProfileForm(String description, Boolean administrator, Boolean general,
			List<Long> idAdmPages) {
		super();
		this.id = null;
		this.administrator = administrator;
		this.description = description;
		this.general = general;
		this.admPages = AdmPageForm.convertFromListIds(idAdmPages);
	}

	public AdmProfileForm(AdmProfile obj) {
		super();
		this.id = obj.getId();
		this.administrator = obj.getAdministrator();
		this.description = obj.getDescription();
		this.general = obj.getGeneral();
		
		List<AdmPage> listPages = new ArrayList<AdmPage>(obj.getAdmPages()); 
		this.admPages = AdmPageForm.convert(listPages);
	}

	public AdmProfile convert() {
		AdmProfile obj = new AdmProfile(description, administrator, general);
		
		if (this.admPages!=null) {
			this.admPages.forEach(page -> {
				obj.getAdmPages().add(new AdmPage(page.getId(), page.getDescription(), page.getUrl()));
			});	
		}

		//List<AdmPage> listPages = new ArrayList<AdmPage>(obj.getAdmPages()); 
		//this.admPages = AdmPageForm.convert(listPages);
		
		return obj; 
	}

	public Optional<AdmProfile> update(Long id, AdmProfileService service) {
		Optional<AdmProfile> bean = service.findById(id);
		bean.get().setAdministrator(this.administrator);
		bean.get().setDescription(this.description);
		bean.get().setGeneral(this.general);
		if (this.admPages!=null) {
			if (this.admPages.size() > 0) {
				bean.get().setAdmPages(new HashSet<AdmPage>(AdmPageForm.convertFromForm(this.admPages)));
			}
		}
		return bean;
	}

	public static List<AdmProfileForm> convert(List<AdmProfile> admProfiles) {
		return admProfiles.stream().map(AdmProfileForm::new).collect(Collectors.toList());
	}

	public static List<AdmProfile> convertFromForm(List<AdmProfileForm> admProfiles) {
		return admProfiles.stream().map(AdmProfile::new).collect(Collectors.toList());
	}

	//public static List<AdmProfileForm> convertFromListIds(List<Long> admProfiles) {
	//	return admProfiles.stream().map(id -> new AdmProfileForm(id)).collect(Collectors.toList());
	//}

	public static List<AdmProfile> convertFromListIds(List<Long> admProfiles) {
		return admProfiles.stream().map(id -> new AdmProfile(id)).collect(Collectors.toList());
	}

	public Boolean getAdministrator() {
		return administrator;
	}

	public void setAdministrator(Boolean administrator) {
		this.administrator = administrator;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getGeneral() {
		return general;
	}

	public void setGeneral(Boolean general) {
		this.general = general;
	}

	public List<AdmPageForm> getAdmPages() {
		return admPages;
	}

	public void setAdmPages(List<AdmPageForm> admPages) {
		this.admPages = admPages;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

}
