DROP TABLE IF EXISTS public.adm_menu;
DROP TABLE IF EXISTS public.adm_page_profile;
DROP TABLE IF EXISTS public.adm_profile;
DROP TABLE IF EXISTS public.adm_page;
DROP TABLE IF EXISTS public.adm_parameter;
DROP TABLE IF EXISTS public.adm_parameter_category;
DROP TABLE IF EXISTS public.vw_adm_funcionario;


DROP SEQUENCE IF EXISTS public.adm_parameter_category_seq;
DROP SEQUENCE IF EXISTS public.adm_parameter_seq;
DROP SEQUENCE IF EXISTS public.adm_page_seq;
DROP SEQUENCE IF EXISTS public.adm_profile_seq;
DROP SEQUENCE IF EXISTS public.adm_menu_seq;
DROP SEQUENCE IF EXISTS public.vw_adm_funcionario_seq;


CREATE TABLE public.adm_parameter_category (
	pmc_seq int8 NOT NULL,
	pmc_description varchar(64) NOT NULL,
	pmc_order int8 NULL,
	CONSTRAINT adm_parameter_category_pkey PRIMARY KEY (pmc_seq),
	CONSTRAINT adm_pmc_uk UNIQUE (pmc_description)
);

CREATE TABLE public.adm_parameter (
	par_seq int8 NOT NULL,
	par_code varchar(64) NOT NULL,
	par_description varchar(255) NOT NULL,
	par_pmc_seq int8 NOT NULL,
	par_value varchar(4000) NULL,
	CONSTRAINT adm_parameter_pkey PRIMARY KEY (par_seq),
	CONSTRAINT adm_parameter_uk UNIQUE (par_description),
	CONSTRAINT adm_parameter_pmc_fkey FOREIGN KEY (par_pmc_seq) REFERENCES public.adm_parameter_category(pmc_seq)
);

CREATE TABLE public.adm_page (
	pag_seq int8 NOT NULL,
	pag_description varchar(255) NOT NULL,
	pag_url varchar(255) NOT NULL,
	CONSTRAINT adm_page_description_uk UNIQUE (pag_description),
	CONSTRAINT adm_page_pkey PRIMARY KEY (pag_seq),
	CONSTRAINT adm_page_url_uk UNIQUE (pag_url)
);

CREATE TABLE public.adm_profile (
	prf_seq int8 NOT NULL,
	prf_administrator bpchar(1) NULL DEFAULT 'N'::bpchar,
	prf_description varchar(255) NOT NULL,
	prf_general bpchar(1) NULL DEFAULT 'N'::bpchar,
	CONSTRAINT adm_profile_pkey PRIMARY KEY (prf_seq),
	CONSTRAINT adm_profile_uk UNIQUE (prf_description)
);

CREATE TABLE public.adm_page_profile (
	pgl_prf_seq int8 NOT NULL,
	pgl_pag_seq int8 NOT NULL,
	CONSTRAINT adm_page_profile_pkey PRIMARY KEY (pgl_prf_seq, pgl_pag_seq),
	CONSTRAINT adm_pgl_page_fkey FOREIGN KEY (pgl_pag_seq) REFERENCES public.adm_page(pag_seq),
	CONSTRAINT adm_pgl_profile_fkey FOREIGN KEY (pgl_prf_seq) REFERENCES public.adm_profile(prf_seq)
);

CREATE TABLE public.adm_menu (
	mnu_seq int8 NOT NULL,
	mnu_description varchar(255) NOT NULL,
	mnu_parent_seq int8 NULL,
	mnu_pag_seq int8 NULL,
	mnu_order int4 NULL,
	CONSTRAINT adm_menu_pkey PRIMARY KEY (mnu_seq),
	CONSTRAINT adm_menu_uk UNIQUE (mnu_description),
	CONSTRAINT adm_menu_page_fkey FOREIGN KEY (mnu_pag_seq) REFERENCES public.adm_page(pag_seq),
	CONSTRAINT adm_menu_parent_fkey FOREIGN KEY (mnu_parent_seq) REFERENCES public.adm_menu(mnu_seq)
);

CREATE TABLE public.vw_adm_funcionario (
	cod_funcionario int8 NOT NULL,
	nome varchar(1000) NOT NULL,
	cpf int8 NOT NULL,
	email varchar(1000) NULL DEFAULT NULL::character varying,
	telefone varchar(30) NULL DEFAULT NULL::character varying,
	celular varchar(30) NULL DEFAULT NULL::character varying,
	setor varchar(30) NULL DEFAULT NULL::character varying,
	cod_cargo int8 NULL,
	cargo varchar(1000) NULL DEFAULT NULL::character varying,
	data_admissao timestamp NULL,
	data_saida timestamp NULL,
	ativo bpchar(1) NOT NULL,
	CONSTRAINT vw_adm_funcionario_pkey PRIMARY KEY (cod_funcionario)
);



CREATE SEQUENCE public.adm_parameter_category_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

CREATE SEQUENCE public.adm_parameter_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

CREATE SEQUENCE public.adm_page_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

CREATE SEQUENCE public.adm_profile_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

CREATE SEQUENCE public.adm_menu_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

CREATE SEQUENCE public.vw_adm_funcionario_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
