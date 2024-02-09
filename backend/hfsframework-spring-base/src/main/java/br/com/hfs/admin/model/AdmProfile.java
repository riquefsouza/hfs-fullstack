package br.com.hfs.admin.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import br.com.hfs.admin.controller.form.AdmProfileForm;
import br.com.hfs.converter.BooleanToStringConverter;

@Entity
@Table(name = "ADM_PROFILE")
@NamedQueries({
	@NamedQuery(name = "AdmProfile.getDescriptionById", query = "SELECT c.description FROM AdmProfile c WHERE c.id = ?1"),
	@NamedQuery(name = "AdmProfile.countNovo", query = "SELECT COUNT(c) FROM AdmProfile c WHERE LOWER(c.description) = ?1"),
	@NamedQuery(name = "AdmProfile.countAntigo", query = "SELECT COUNT(c) FROM AdmProfile c WHERE LOWER(c.description) <> ?1 AND LOWER(c.description) = ?2"),

	@NamedQuery(name = "AdmProfile.findProfilesByPage", 
	query = "SELECT distinct p FROM AdmProfile p inner join p.admPages pag where pag.id = ?1"),

	@NamedQuery(name = "AdmProfile.findIdPagesByDescriptionPerfis", 
	query = "SELECT distinct pag.id FROM AdmProfile p inner join p.admPages pag where p.description IN ?1")
})

public class AdmProfile implements Serializable {

	/** The Constant serialVersionUID. */
	private static final long serialVersionUID = 1L;

	/** The id. */
	@Id	
	@GenericGenerator(name = "ADM_PROFILE_ID_GENERATOR",
	strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
    parameters = {
    	@Parameter(name = "sequence_name", value = "ADM_PROFILE_SEQ"),
        @Parameter(name = "initial_value", value = "1"),
        @Parameter(name = "increment_size", value = "1")
	})		
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ADM_PROFILE_ID_GENERATOR")
	@Column(name = "PRF_SEQ")
	private Long id;

	/** The administrator. */
	@Convert(converter = BooleanToStringConverter.class)
	@Column(name = "PRF_ADMINISTRATOR")
	private Boolean administrator;

	/** The description. */
	@NotNull
	@NotBlank
	@NotEmpty
	@Size(min=4, max=255)
	@Column(name = "PRF_DESCRIPTION", unique = true, nullable = false, length = 255)
	private String description;

	/** The general. */
	@Convert(converter = BooleanToStringConverter.class)
	@Column(name = "PRF_GENERAL")
	private Boolean general;

	/** The adm paginas. */
	//@JsonIgnore
	//@JsonSerialize(using = AdmPageListSerializer.class)
	@Fetch(FetchMode.SUBSELECT)
	@ManyToMany(fetch = FetchType.EAGER) //, cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
	@JoinTable(name = "ADM_PAGE_PROFILE", joinColumns = { 
			@JoinColumn(name = "PGL_PRF_SEQ") }, inverseJoinColumns = {	@JoinColumn(name = "PGL_PAG_SEQ") })
	private Set<AdmPage> admPages;
	
	/**
	 * Instantiates a new adm profile.
	 */
	public AdmProfile() {
		super();
		this.admPages = new HashSet<AdmPage>();
		clean();
	}

	public AdmProfile(Long id) {
		this();		
		this.id = id;
	}

	public AdmProfile(Long id, String description) {
		this();		
		this.id = id;
		this.description = description;
	}

	public AdmProfile(Long id, String description, Boolean administrator, Boolean general) {
		this();
		this.id = id;
		this.administrator = administrator;
		this.description = description;
		this.general = general;
	}

	public AdmProfile(String description, Boolean administrator, Boolean general) {
		this();
		this.administrator = administrator;
		this.description = description;
		this.general = general;		
	}

	public AdmProfile(AdmProfileForm p) {
		this();
		
		this.id = p.getId();
		this.administrator = p.getAdministrator();
		this.description = p.getDescription();
		this.general = p.getGeneral();
/*
		for (AdmPageForm page : p.getAdmPages()) {
			this.admPages.add(new AdmPage(page));	
		}
 */		
	}


	/**
	 * Limpar.
	 */
	public void clean() {
		this.id = null;
		this.administrator = null;
		this.description = null;
		this.general = null;
		this.admPages.clear();
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
	 * Pega o the administrator.
	 *
	 * @return o the administrator
	 */
	public Boolean getAdministrator() {
		return this.administrator;
	}

	/**
	 * Atribui o the administrator.
	 *
	 * @param administrator
	 *            o novo the administrator
	 */
	public void setAdministrator(Boolean administrator) {
		this.administrator = administrator;
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
	 * Pega o the general.
	 *
	 * @return o the general
	 */
	public Boolean getGeneral() {
		return this.general;
	}

	/**
	 * Atribui o the general.
	 *
	 * @param general
	 *            o novo the general
	 */
	public void setGeneral(Boolean general) {
		this.general = general;
	}

	/**
	 * Pega o the adm paginas.
	 *
	 * @return o the adm paginas
	 */
	public Set<AdmPage> getAdmPages() {
		return this.admPages;
	}

	/**
	 * Atribui o the adm paginas.
	 *
	 * @param admPages
	 *            o novo the adm paginas
	 */
	public void setAdmPages(Set<AdmPage> admPages) {
		this.admPages = admPages;
	}
	
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
		AdmProfile other = (AdmProfile) obj;
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
		return description;
	}
		
}