import { Link } from 'react-router-dom';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types';
import { LayoutContext } from './context/layoutcontext';
import keycloakService from '../main';
import { classNames } from '../base/util/LayoutUtils';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const AppTopbar = forwardRef<AppTopbarRef>(() => {
    const { layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    
    useImperativeHandle(undefined, () => ({
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
            <IconButton ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <MenuIcon fontSize="inherit" />
            </IconButton>            
{/*
            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
 */}
            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <Link to="/system/usuario">
                    <IconButton type="button" className="p-link layout-topbar-button" aria-label="Perfil">
                        <PersonIcon fontSize="inherit" />
                    </IconButton>
                </Link>                    
                <Link to="/system/config">
                    <IconButton type="button" className="p-link layout-topbar-button" aria-label="Configurações">
                        <SettingsIcon fontSize="inherit" />
                    </IconButton>
                </Link>                    
                <IconButton type="button" className="p-link layout-topbar-button" onClick={logout} aria-label="Sair">
                    <LogoutIcon fontSize="inherit" />
                </IconButton>
            </div>
             
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
