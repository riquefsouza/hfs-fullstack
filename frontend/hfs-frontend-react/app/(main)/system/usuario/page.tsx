'use client';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { UserAuthenticated, emptyUserAuthenticated } from '../../base/models/UserAuthenticated';
import { SessionStorageService } from '../../base/services/SessionStorageService';

const UsuarioPage = () => {

    const sessionStorageService = new SessionStorageService();
    
    const [userAuthenticated, setUserAuthenticated] = useState<UserAuthenticated>(emptyUserAuthenticated);
    const [listaRoles, setListaRoles] = useState<[]>([]);

    useEffect(() => {
        setUserAuthenticated(sessionStorageService.getPersistedObj('userAuthenticated') as UserAuthenticated);
        
        let lista: [] = [];
        userAuthenticated.roles.forEach((role, index) => {
            lista.push(<li key={index}>{role}</li>);
        });     
        
        setListaRoles(lista);
        
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="card px-6 py-6">
                        <Card header="Usuário logado">
                            <p className="m-0">
                                <b>ID: </b>
                                {userAuthenticated.id}
                                <br></br>
                                <br></br>
                                <b>Login: </b>
                                {userAuthenticated.userName}
                                <br></br>
                                <br></br>
                                <b>E-mail: </b>
                                {userAuthenticated.email}
                                <br></br>
                                <br></br>
                                <b>E-mail verificado: </b>
                                {userAuthenticated.emailVerified ? 'Sim' : 'Não'}
                                <br></br>
                                <br></br>
                                <b>Nome: </b>
                                {userAuthenticated.fullName}
                                <br></br>
                                <br></br>
                                <b>É administrador: </b>
                                {userAuthenticated.isAdmin ? 'Sim' : 'Não'}
                                <br></br>
                                <br></br>
                                <b>Papéis: </b>
                                {listaRoles}
                                <br></br>
                                <br></br>
                            </p>
                        </Card>       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsuarioPage;
