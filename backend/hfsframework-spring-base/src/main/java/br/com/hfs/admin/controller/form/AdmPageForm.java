package br.com.hfs.admin.controller.form;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import br.com.hfs.admin.model.AdmPage;
import br.com.hfs.admin.model.AdmProfile;
import br.com.hfs.admin.service.AdmPageService;

public class AdmPageForm {
	
	private Long id;
	
	private String description;

	private String url;
		
	private List<Long> admIdProfiles;

	public AdmPageForm() {
		super();
	}
	
	public AdmPageForm(Long id) {
		super();
		this.id = id;
	}

	public AdmPageForm(String description, String url, List<Long> admIdProfiles) {
		super();
		this.id = null;
		this.description = description;
		this.url = url;
		this.admIdProfiles = admIdProfiles;
		//this.admIdProfiles = AdmProfileForm.convertFromListIds(idAdmProfiles);
	}

	public AdmPageForm(AdmPage obj) {
		this.id = obj.getId();
		this.description = obj.getDescription();
		this.url = obj.getUrl();

		this.admIdProfiles = new ArrayList<Long>();
		obj.getAdmProfiles().forEach(profile -> this.admIdProfiles.add(profile.getId()));

		//List<AdmProfile> listProfiles = new ArrayList<AdmProfile>(obj.getAdmProfiles()); 
		//this.admProfiles = AdmProfileForm.convert(listProfiles);
	}
	
	public AdmPage convert() {
		AdmPage obj = new AdmPage(description, url);
		
		if (this.admIdProfiles!=null) {
			this.admIdProfiles.forEach(profile -> {
				obj.getAdmProfiles().add(new AdmProfile(profile));
			});	
		}

		return obj;
	}

	public Optional<AdmPage> update(Long id, AdmPageService service) {
		Optional<AdmPage> bean = service.findById(id);
		bean.get().setDescription(this.description);
		bean.get().setUrl(this.url);
		if (this.admIdProfiles!=null) {
			if (this.admIdProfiles.size() > 0) {
				bean.get().setAdmProfiles(
					new HashSet<AdmProfile>(AdmProfileForm.convertFromListIds(this.admIdProfiles))
				);
			}
		}
		return bean;
	}
	
	public static List<AdmPageForm> convert(List<AdmPage> admPages) {
		return admPages.stream().map(AdmPageForm::new).collect(Collectors.toList());
	}

	public static List<AdmPage> convertFromForm(List<AdmPageForm> admPages) {
		return admPages.stream().map(AdmPage::new).collect(Collectors.toList());
	}

	public static List<AdmPageForm> convertFromListIds(List<Long> admPages) {
		return admPages.stream().map(id -> new AdmPageForm(id)).collect(Collectors.toList());
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Long> getAdmIdProfiles() {
		return admIdProfiles;
	}

	public void setAdmIdProfiles(List<Long> admIdProfiles) {
		this.admIdProfiles = admIdProfiles;
	}

}
