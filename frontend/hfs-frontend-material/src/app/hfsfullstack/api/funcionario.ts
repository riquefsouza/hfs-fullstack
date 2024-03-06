export interface Funcionario {
    id?: number | null;
    nome?: string;
    cpf?: number;
    email?: string;
    telefone?: string;
	celular?: string;
	setor?: string;
	codCargo?: number;
	cargo?: string;
	dataAdmissao?: Date;
	dataSaida?: Date;
    ativo?: boolean;
	cpfFormatado?: string;
	dataAdmissaoFormatada?: string;
	dataSaidaFormatada?: string;
}

export const cleanFuncionario: Funcionario = {
    nome: '',
    cpf: 0,
    email: '',
    telefone: '',
	celular: '',
	setor: '',
	codCargo: 0,
	cargo: '',
	dataAdmissao: null,
	dataSaida: null,
    ativo: false,
	cpfFormatado: '',
	dataAdmissaoFormatada: '',
	dataSaidaFormatada: ''
};

export const emptyFuncionario: Funcionario = {    
    id: null,
    nome: '',
    cpf: 0,
    email: '',
    telefone: '',
	celular: '',
	setor: '',
	codCargo: 0,
	cargo: '',
	dataAdmissao: null,
	dataSaida: null,
    ativo: false,
	cpfFormatado: '',
	dataAdmissaoFormatada: '',
	dataSaidaFormatada: ''
};
