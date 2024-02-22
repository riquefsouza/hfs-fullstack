import React, { useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
//import keycloakService from '../base/providers/KeycloakProvider';
import keycloakService from '../main';

const AppMenu = () => {    

    const [model, setModel] = useState<AppMenuItem[]>([]);
    
    const sistemaItemMenu: AppMenuItem = {
        label: 'Sistema',
        items: [
            { label: 'Usuário logado', to: '/system/usuario' },
            { label: 'Configuração de Tela', to: '/system/config' },
        ]
    };
    
    /*
    const sistemaItemMenu: AppMenuItem[] = [
        {
            label: 'Cadastros',
            items: [
                { label: 'Funcionários', to: '/hfs/funcionario' }
            ]
        },
        {
            label: 'Administrativo',
            items: [
                { label: 'Categoria dos Parâmetros', to: '/admin/admParameterCategory' },
                { label: 'Parâmetros', to: '/admin/admParameter' },
                { label: 'Perfis', to: '/admin/admProfile' },
                { label: 'Páginas', to: '/admin/admPage' },
                { label: 'Menus', to: '/admin/admMenu' }
            ]
        },
        {
            label: 'Sistema',
            items: [
                { label: 'Usuário logado', to: '/system/usuario' },
                { label: 'Configuração de Tela', to: '/system/config' },
            ]
        }
    ];    
    */

    useEffect(() => {
        const _model: AppMenuItem[] = [];
        const menus = keycloakService.getMenus();

        if (menus && menus.length > 0) {            
            menus.forEach(item => {
                _model.push(item);
            });        
            _model.push(sistemaItemMenu);
        }
        setModel(_model);        
        //setModel(sistemaItemMenu);
        
    }, []);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
