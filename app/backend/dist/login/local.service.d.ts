declare class LocalService {
    static handleLocalLogin(email: string, password: string): Promise<{
        token: any;
    }>;
    static handleLocalRegister(name: string, email: string, password: string): Promise<User>;
}
export { LocalService };
