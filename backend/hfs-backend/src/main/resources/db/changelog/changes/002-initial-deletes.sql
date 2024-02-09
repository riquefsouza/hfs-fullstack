delete from adm_menu;
delete from adm_page_profile;
delete from adm_profile;
delete from adm_page;
delete from adm_parameter;
delete from adm_parameter_category;


ALTER SEQUENCE public.adm_menu_seq RESTART WITH 1;
ALTER SEQUENCE public.adm_profile_seq RESTART WITH 1;
ALTER SEQUENCE public.adm_page_seq RESTART WITH 1;
ALTER SEQUENCE public.adm_parameter_seq RESTART WITH 1;
ALTER SEQUENCE public.adm_parameter_category_seq RESTART WITH 1;


delete from vw_adm_funcionario;
ALTER SEQUENCE public.vw_adm_funcionario_seq RESTART WITH 1;
