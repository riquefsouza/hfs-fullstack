package br.com.hfs.admin.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import br.com.hfs.admin.model.AdmProfile;

public interface AdmProfileRepository extends JpaRepository<AdmProfile, Long> {

	Page<AdmProfile> findByDescriptionLike(String description, Pageable pagination);
	
	List<AdmProfile> findByDescriptionLike(String description);
	
	@Query(name = "AdmProfile.findProfilesByPage")
	public List<AdmProfile> findProfilesByPage(Long idPage);

	@Query(name = "AdmProfile.findIdPagesByDescriptionPerfis")
	List<Long> findIdPagesByDescriptionPerfis(List<String> listaProfile);

	@Modifying
	@Query(value = "ALTER SEQUENCE public.adm_profile_seq RESTART WITH 1", nativeQuery = true)
	void restartSequence();

	@Modifying(flushAutomatically = true)
	@Query(value = "delete from public.adm_page_profile", nativeQuery = true)
	void deleteAllPageProfileNative();
	
}
