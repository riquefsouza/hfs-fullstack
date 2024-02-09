package br.com.hfs.admin.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.hfs.admin.controller.form.AdmPageForm;

@Entity
@Table(name="ADM_PAGE")
@NamedQueries({
	@NamedQuery(name = "AdmPage.getDescriptionById", query = "SELECT c.url FROM AdmPage c WHERE c.id = ?1"),
	@NamedQuery(name = "AdmPage.countNovo", query = "SELECT COUNT(c) FROM AdmPage c WHERE LOWER(c.url) = ?1"),
	@NamedQuery(name = "AdmPage.countAntigo", query = "SELECT COUNT(c) FROM AdmPage c WHERE LOWER(c.url) <> ?1 AND LOWER(c.url) = ?2"),	
	@NamedQuery(name = "AdmPage.findPerfisPorPage", query="SELECT distinct p FROM AdmPage pag inner join pag.admProfiles p where pag = ?1")
})
public class AdmPage implements Serializable {
	
	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	/** The id. */
	@Id	
	@GenericGenerator(name = "ADM_PAGE_ID_GENERATOR",
	strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
    parameters = {
    	@Parameter(name = "sequence_name", value = "ADM_PAGE_SEQ"),
        @Parameter(name = "initial_value", value = "1"),
        @Parameter(name = "increment_size", value = "1")
	})		
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ADM_PAGE_ID_GENERATOR")	
	@Column(name="PAG_SEQ")
	private Long id;

	/** The description. */
	@NotNull
	@NotBlank
	@NotEmpty
	@Size(min=4, max=255)
	@Column(name="PAG_DESCRIPTION", unique = true, nullable = false, length = 255)
	private String description;

	/** The url. */
	@NotNull
	@NotBlank
	@NotEmpty	
	@Size(min=4, max=255)
	@Column(name="PAG_URL", unique = true, nullable = false, length = 255)
	private String url;

	/** The adm profiles. */ 
	//bi-directional many-to-many association to AdmProfile
	//@ManyToMany(mappedBy="admPages", fetch = FetchType.LAZY) //, cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
	@JsonIgnore
	//@JsonSerialize(using = AdmProfileSetSerializer.class)
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "ADM_PAGE_PROFILE", joinColumns = { 
			@JoinColumn(name = "PGL_PAG_SEQ") }, inverseJoinColumns = {@JoinColumn(name = "PGL_PRF_SEQ") })
	private Set<AdmProfile> admProfiles;
	
	/*
	@JsonIgnore
	@Fetch(FetchMode.SUBSELECT)
	@OneToMany(mappedBy = "admPage", orphanRemoval = true, fetch = FetchType.LAZY)	
	private Set<AdmMenu> admMenus;	
	*/

	@Transient
	private List<Long> admIdProfiles;

	@Transient
	private String pageProfiles;

	/**
	 * Instantiates a new adm pagina.
	 */
	public AdmPage() {
		super();
		this.admProfiles = new HashSet<AdmProfile>();
		//this.admMenus = new HashSet<AdmMenu>();
		this.admIdProfiles = new ArrayList<Long>();
		clean();
	}

	public AdmPage(Long id, String description, String url) {
		this();
		this.id = id;
		this.description = description;
		this.url = url;
	}

	public AdmPage(String description, String url) {
		this();
		this.description = description;
		this.url = url;
	}
	
	public AdmPage(AdmPageForm p) {
		this();
		
		this.id = p.getId();
		this.description = p.getDescription();
		this.url = p.getUrl();
/*
		for (AdmProfileForm profile : p.getAdmProfiles()) {
			this.admProfiles.add(new AdmProfile(profile));	
		}
 */		
	}
	
	/**
	 * Limpar.
	 */
	public void clean() {
		this.id = null;
		this.description = null;
		this.url = null;
		this.admProfiles.clear();
		//this.admMenus.clear();
		this.admIdProfiles.clear();
		this.pageProfiles = null;
	}

	/**
	 * Pega o the id.
	 *
	 * @return o the id
	 */
	public Long getId() {
		return this.id;
	}

	/**
	 * Atribui o the id.
	 *
	 * @param id
	 *            o novo the id
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * Pega o the description.
	 *
	 * @return o the description
	 */
	public String getDescription() {
		return this.description;
	}

	/**
	 * Atribui o the description.
	 *
	 * @param description
	 *            o novo the description
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * Pega o the url.
	 *
	 * @return o the url
	 */
	public String getUrl() {
		return this.url;
	}

	/**
	 * Atribui o the url.
	 *
	 * @param url
	 *            o novo the url
	 */
	public void setUrl(String url) {
		this.url = url;
	}

	/**
	 * Pega o the adm profiles.
	 *
	 * @return o the adm profiles
	 */
	public Set<AdmProfile> getAdmProfiles() {
		return this.admProfiles;
	}

	/**
	 * Atribui o the adm profiles.
	 *
	 * @param admProfiles
	 *            o novo the adm profiles
	 */
	public void setAdmProfiles(Set<AdmProfile> admProfiles) {
		this.admProfiles = admProfiles;
	}
	/*
	public Set<AdmMenu> getAdmMenus() {
		return admMenus;
	}

	public void setAdmMenus(Set<AdmMenu> admMenus) {
		this.admMenus = admMenus;
	}
	 */
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AdmPage other = (AdmPage) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return this.url;
	}

	/**
	 * Gets the perfis pagina.
	 *
	 * @return the perfis pagina
	 */
	public String getPerfisPage() {
		String ret = "";
		for (AdmProfile item : getAdmProfiles()) {
			ret = ret.concat(item.getDescription()).concat(", ");
		}
		if (ret != "") {
			ret = ret.substring(0, ret.length() - 2);
		}
		return ret;
	}

	public List<Long> getAdmIdProfiles() {
		return admIdProfiles;
	}

	public void setAdmIdProfiles(List<Long> admIdProfiles) {
		this.admIdProfiles = admIdProfiles;
	}

	public String getPageProfiles() {
		return pageProfiles;
	}

	public void setPageProfiles(String pageProfiles) {
		this.pageProfiles = pageProfiles;
	}
	
}