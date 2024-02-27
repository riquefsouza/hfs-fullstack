'use client';
import { useEffect, useState } from 'react';
import { UserAuthenticated, emptyUserAuthenticated } from '../../base/models/UserAuthenticated';
import keycloakService from '../../main';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

const UsuarioPage = () => {
    
    const [userAuthenticated, setUserAuthenticated] = useState<UserAuthenticated>(emptyUserAuthenticated);
    const [listaRoles, setListaRoles] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        setUserAuthenticated(keycloakService.getUserAuthenticated());
        
        let lista: React.JSX.Element[] = [];
        keycloakService.getUserAuthenticated().roles.forEach((role, index) => {
            lista.push(<li key={index}>{role}</li>);
        });
        
        setListaRoles(lista);    

    }, []);

    return (
        <Card>
            <CardHeader title="Usuário logado"/>
            <CardContent>
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
            </CardContent>
        </Card>       
    );
};

export default UsuarioPage;
