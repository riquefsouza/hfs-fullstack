import { Entidade } from "../../base/models/Entidade";

export const emptyAdmPage: AdmPage = {
    id: null,
    description: '',
    url: '',
    admIdProfiles: [],
    pageProfiles: ''
};

export const cleanAdmPage: AdmPage = {
    description: '',
    url: '',
    admIdProfiles: [],
    pageProfiles: ''
};

export interface AdmPage extends Entidade {
    id?: number | null;
    description: string;
    url: string;
    admIdProfiles: number[];
    pageProfiles: string;
}
