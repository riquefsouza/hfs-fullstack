export class SessionStorageService {

    public clearStorage(): void {
        window.sessionStorage.clear();
    }

    public persistItem(key: string, value: string): void {
        window.sessionStorage.setItem(key, value);
    }

    public getPersistedItem(key: string): string | null {
        return window.sessionStorage.getItem(key);
    }

    public removePersistedItem(key: string): void {
        window.sessionStorage.removeItem(key);
    }

    public persistObj(key: string, value: object): void {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }

    public getPersistedObj(key: string): object {
        let obj: any = window.sessionStorage.getItem(key);
        return JSON.parse(obj);
    }

    public removePersistedObj(key: string): void {
        window.sessionStorage.removeItem(key);
    }

}