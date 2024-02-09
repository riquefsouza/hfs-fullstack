package br.com.hfs.admin.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.hfs.admin.controller.dto.MenuItemDTO;
import br.com.hfs.admin.model.AdmMenu;
import br.com.hfs.admin.model.AdmProfile;
import br.com.hfs.admin.repository.AdmMenuRepository;
import br.com.hfs.admin.repository.AdmProfileRepository;
import br.com.hfs.base.BaseService;
import jakarta.transaction.Transactional;

@Service
public class AdmProfileService extends BaseService<AdmProfile, Long, AdmProfileRepository> {

	private static final long serialVersionUID = 1L;

	@Autowired
	private AdmMenuRepository  menuRepository;

	public AdmProfileService() {
		super(AdmProfile.class);
	}
	
	public Page<AdmProfile> findByDescriptionLike(String description, Pageable pagination){
		return repository.findByDescriptionLike(description, pagination);
	}
	
	public List<AdmProfile> findByDescriptionLike(String description){
		return repository.findByDescriptionLike(description);
	}
	
	public List<AdmProfile> findPaginated(int pageNumber, int pageSize) {
		return findPaginated("ADM_PROFILE", "PRF_SEQ", pageNumber, pageSize);
	}

	public List<AdmProfile> listByRange(int startInterval, int endInterval) {
		return listByRange("ADM_PROFILE", "PRF_SEQ", startInterval, endInterval);
	}

	@Transactional
	public void restartSequence(){
		repository.restartSequence();
	}

	@Transactional
	public void deleteAllPageProfileNative(){
		repository.deleteAllPageProfileNative();
	}
				
	public List<AdmProfile> findProfilesByPage(Long idPage) {
		return repository.findProfilesByPage(idPage);
	}
	
	public List<MenuItemDTO> mountMenuItem(List<String> listaProfile) {
		List<MenuItemDTO> lista = new ArrayList<MenuItemDTO>();
				
		this.findMenuParentByDescriptionPerfis(listaProfile).forEach(menu -> {			
			List<MenuItemDTO> item = new ArrayList<MenuItemDTO>();
			
			menu.getAdmSubMenus().forEach(submenu -> {
				MenuItemDTO submenuVO = new MenuItemDTO(submenu.getDescription(), submenu.getUrl());
				item.add(submenuVO);
			});
			
			MenuItemDTO vo = new MenuItemDTO(menu.getDescription(), menu.getUrl(), item);
			lista.add(vo);
		});
		
		this.findAdminMenuParentByDescriptionPerfis(listaProfile).forEach(menu -> {			
			List<MenuItemDTO> item = new ArrayList<MenuItemDTO>();
			
			menu.getAdmSubMenus().forEach(submenu -> {
				MenuItemDTO submenuVO = new MenuItemDTO(submenu.getDescription(), submenu.getUrl());
				item.add(submenuVO);
			});
			
			MenuItemDTO vo = new MenuItemDTO(menu.getDescription(), menu.getUrl(), item);
			lista.add(vo);
		});
		
		return lista;
	}

	public List<AdmMenu> findMenuParentByDescriptionPerfis(List<String> listaProfile){
		List<Long> listaIdPages = repository.findIdPagesByDescriptionPerfis(listaProfile);
		List<AdmMenu> lista = menuRepository.findMenuParentByIdPages(listaIdPages);

		for (AdmMenu admMenu : lista) {
			List<Long> sublistaIdPages = repository.findIdPagesByDescriptionPerfis(listaProfile);
			admMenu.setAdmSubMenus(menuRepository.findMenuByIdPages(sublistaIdPages, admMenu.getId()));
		}
		return lista;
	}

	public List<AdmMenu> findAdminMenuParentByDescriptionPerfis(List<String> listaProfile){
		List<Long> listaIdPages = repository.findIdPagesByDescriptionPerfis(listaProfile);
		List<AdmMenu> lista = menuRepository.findAdminMenuParentByIdPages(listaIdPages);

		for (AdmMenu admMenu : lista) {
			List<Long> sublistaIdPages = repository.findIdPagesByDescriptionPerfis(listaProfile);
			admMenu.setAdmSubMenus(menuRepository.findAdminMenuByIdPages(sublistaIdPages, admMenu.getId()));
		}
		return lista;
	}

}
