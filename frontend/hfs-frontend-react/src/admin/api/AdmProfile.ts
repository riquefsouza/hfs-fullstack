import { AdmPage } from './AdmPage';

export const emptyAdmProfile: AdmProfile = {
    id: null,
    administrator: false,
    description: '',
    general: false,
    admPages: [],
    profilePages: ''
};

export const cleanAdmProfile: AdmProfile = {
    administrator: false,
    description: '',
    general: false,
    admPages: [],
    profilePages: ''
};

export interface AdmProfile {
    id?: number | null;
    administrator?: boolean;
    description?: string;
    general?: boolean;
    admPages?: AdmPage[];
    profilePages?: string;
}
