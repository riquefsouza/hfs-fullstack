import { Link } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types';
import { LayoutContext } from './context/layoutcontext';
import keycloakService from '../main';

const AppTopbar = forwardRef<AppTopbarRef>((_props, ref) => {
    const { layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    
    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const logout = async () => {
        await keycloakService.logout();
    };

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <span>HFS FULLSTACK</span>
            </Link>
            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Link to="/system/usuario">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                </Link>                    
                <Link to="/system/config">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Configurações</span>
                    </button>
                </Link>                    
                <button type="button" className="p-link layout-topbar-button" onClick={logout}>
                    <i className="pi pi-sign-out"></i>
                    <span>Sair</span>
                </button>
            </div>
             
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
