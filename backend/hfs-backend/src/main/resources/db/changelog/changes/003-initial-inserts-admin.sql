INSERT INTO public.adm_parameter_category(pmc_seq, pmc_description, pmc_order) VALUES(nextval('public.adm_parameter_category_seq'), 'Login Parameters', 2);
INSERT INTO public.adm_parameter_category(pmc_seq, pmc_description, pmc_order) VALUES(nextval('public.adm_parameter_category_seq'), 'E-mail Parameters', 3);
INSERT INTO public.adm_parameter_category(pmc_seq, pmc_description, pmc_order) VALUES(nextval('public.adm_parameter_category_seq'), 'Network connection Parameters', 4);
INSERT INTO public.adm_parameter_category(pmc_seq, pmc_description, pmc_order) VALUES(nextval('public.adm_parameter_category_seq'), 'System Parameters', NULL);
INSERT INTO public.adm_parameter_category(pmc_seq, pmc_description, pmc_order) VALUES(nextval('public.adm_parameter_category_seq'), 'teste 2345', NULL);
	
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'BLOQUEAR_LOGIN', 'Bloquear o sistema para que os usuários, exceto do administador, não façam login', 2, 'false');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'ATRIBUTO_LOGIN', 'Define o atributo usado para efetuar login no sistema. Este parâmetro pode ser preenchido com: NOME_USUARIO ou CPF', 2, 'NOME_USUARIO');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'SMTP_SERVIDOR', 'Servidor SMTP para que o sistema envie e-mail.', 3, 'smtp.trt1.jus.br');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'SMTP_PORTA', 'Porta do servidor SMTP para que o sistema envie e-mail.', 3, '25');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'SMTP_USERNAME', 'Usuário para login no servidor SMTP.', 3, NULL);
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'SMTP_PASSWORD', 'Senha para login no servidor SMTP.', 3, NULL);
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'SMTP_EMAIL_FROM', 'E-mail do sistema.', 3, 'sistema@trt1.jus.br');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'PROXY_SERVIDOR', 'Servidor do Proxy.', 4, 'proxy.trtrio.gov.br');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'PROXY_PORTA', 'Porta do Proxy.', 4, '8080');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'AMBIENTE_SISTEMA', 'Define o ambiente onde o sistema está instalado. Este parâmetro pode ser preenchido com: desenvolvimento, homologação ou produção', 2, 'Produção');
INSERT INTO public.adm_parameter(par_seq, par_code, par_description, par_pmc_seq, par_value)
VALUES(nextval('public.adm_parameter_seq'), 'MODO_TESTE', 'Habilitar o modo de teste por login, esquema do json [  { "ativo": "false", "login" : "fulano", "setor" : "DISAD", "cargo": "15426" } ]', 2, '[ { "ativo": "false", "login" : "rafael.remiro", "setor" : "ESACS RJ", "cargo": "15426", "loginVirtual": "" }, { "ativo": "false", "login" : "fabricio.peres", "setor" : "CSEG", "cargo": "15426", "loginVirtual": "" }, { "ativo": "false", "login" : "henrique.souza", "setor" : "SAM", "cargo": "15426", "loginVirtual": "" }]');

INSERT INTO public.adm_profile (prf_seq,prf_administrator,prf_description,prf_general) VALUES
	 (nextval('public.adm_profile_seq'),'S','Administrador','N'),
	 (nextval('public.adm_profile_seq'),'N','Gestor','S');
	 
INSERT INTO public.adm_page (pag_seq,pag_description,pag_url) VALUES
	 (nextval('public.adm_page_seq'),'Categoria dos Parâmetros','/admin/admParameterCategory'),
	 (nextval('public.adm_page_seq'),'Parâmetros','/admin/admParameter'),
	 (nextval('public.adm_page_seq'),'Perfis','/admin/admProfile'),
	 (nextval('public.adm_page_seq'),'Páginas','/admin/admPage'),
	 (nextval('public.adm_page_seq'),'Menus','/admin/admMenu'),
	 (nextval('public.adm_page_seq'),'Funcionários','/hfs/funcionario');

INSERT INTO public.adm_page_profile (pgl_prf_seq,pgl_pag_seq) VALUES
	 (1,1),
	 (1,2),
	 (1,3),
	 (1,4),
	 (1,5),
	 (1,6),
	 (2,6);

INSERT INTO public.adm_menu (mnu_seq,mnu_description,mnu_parent_seq,mnu_pag_seq,mnu_order) VALUES
	 (nextval('public.adm_menu_seq'),'Administrativo',NULL,NULL,1),
	 (nextval('public.adm_menu_seq'),'Categoria dos Parâmetros',1,1,2),
	 (nextval('public.adm_menu_seq'),'Parâmetros',1,2,3),
	 (nextval('public.adm_menu_seq'),'Perfis',1,3,4),
	 (nextval('public.adm_menu_seq'),'Páginas',1,4,5),
	 (nextval('public.adm_menu_seq'),'Menus',1,5,6),
	 (nextval('public.adm_menu_seq'),'Cadastros',NULL,NULL,2),
	 (nextval('public.adm_menu_seq'),'Funcionários',7,6,1);	 

