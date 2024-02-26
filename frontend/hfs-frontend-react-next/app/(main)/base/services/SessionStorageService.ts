export class SessionStorageService {

    public clearStorage(): void {
        sessionStorage.clear();
    }

    public persistItem(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    public getPersistedItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    public removePersistedItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    public persistObj(key: string, value: object): void {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    public getPersistedObj(key: string): object {
        let obj: any = sessionStorage.getItem(key);
        return JSON.parse(obj);
    }

    public removePersistedObj(key: string): void {
        sessionStorage.removeItem(key);
    }

}