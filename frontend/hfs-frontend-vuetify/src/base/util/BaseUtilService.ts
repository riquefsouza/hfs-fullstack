export class BaseUtilService {

    constructor(){}

    public formatDate(value: Date) {
        return value.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    public formatCurrency(value: number) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    public cpfParaCpfFormatado(cpf: number): string {
        let scpf = cpf.toString();

        if (scpf.length == 10) scpf = '0' + scpf;
        if (scpf.length == 9) scpf = '00' + scpf;

        return scpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    public cpfFormatadoParaCpf(cpfFormatado: string): number | null {
        if (cpfFormatado.length == 14)
            return parseInt(cpfFormatado.replaceAll(".", "").replaceAll("-", ""), 10);

        return null;
    }

    public dataStringToDate(sdata: string): Date | null {
        if (sdata != null) {
            if (sdata.length == 10) {
                let dia: string = sdata.substring(0, 2);
                let mes: string = sdata.substring(3, 5);
                let ano: string = sdata.substring(6, 10);

                let ndia: number = parseInt(dia);
                let nmes: number = parseInt(mes);
                let nano: number = parseInt(ano);

                return new Date(nano, nmes - 1, ndia, 0, 0, 0, 0);
            }
        }

        return null;
    }

    public readFileContent(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!file) {
                //resolve('');
                reject('');
            }

            const reader = new FileReader();

            reader.onload = (evt: ProgressEvent<FileReader>) => {
                if (evt.target != null && evt.target.result != null){
                    const text: string = evt.target.result.toString();
                    resolve(text);    
                }
            };

            reader.readAsText(file);
        });
    }
}