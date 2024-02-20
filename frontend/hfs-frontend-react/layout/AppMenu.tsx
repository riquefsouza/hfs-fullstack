/* eslint-disable @next/next/no-img-element */

import React, { useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { SessionStorageService } from '@/app/(main)/base/services/SessionStorageService';
import { UserAuthenticated } from '@/app/(main)/base/models/UserAuthenticated';
import { MenuItemDTO } from '@/app/(main)/base/models/MenuItemDTO';

const AppMenu = () => {    

    const sessionStorageService = new SessionStorageService();
    //const model: AppMenuItem[] = [];
    //const sistemaItemMenu: AppMenuItem = 
    const model: AppMenuItem[] = [
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

    useEffect(() => {
        const user: UserAuthenticated = sessionStorageService.getPersistedObj('userAuthenticated') as UserAuthenticated;

        if (user.roles.length > 0) {
            /*
            admProfileService.mountMenu(user.roles)
            .then((menus: MenuItemDTO[]) => {
    
                model = menus;
    
                if (model) {
                  model.push(sistemaItemMenu);
                }
            });
            */    
        }

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
