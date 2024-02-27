'use client';

import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { LayoutConfig } from '../types';
//import { classNames } from '../base/util/LayoutUtils';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Radio from '@mui/material/Radio';

const AppConfig = () => {
    const [scales] = useState([12, 13, 14, 15, 16]);
    //const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    //const { setRipple, changeTheme } = useContext(PrimeReactContext);
    /*
        const onConfigButtonClick = () => {
            setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: true }));
        };
    
        const onConfigSidebarHide = () => {
            setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: false }));
        };
        
        const changeRipple = (e: InputSwitchChangeEvent) => {
            setRipple?.(e.value as boolean);
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, ripple: e.value as boolean }));
        };
    */

    const changeInputStyle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, inputStyle: e.target.value }));
    };

    const changeMenuMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, menuMode: e.target.value }));
    };

    const _changeTheme = (theme: string, colorScheme: string) => {
        //changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        //});
    };

    const decrementScale = () => {
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, scale: prevState.scale - 1 }));
    };

    const incrementScale = () => {
        setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, scale: prevState.scale + 1 }));
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    useEffect(() => {
        applyScale();
    }, [layoutConfig.scale]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card px-6 py-6">

                    <h5>Esquema de cor</h5>
                    <div className="grid">
                        <div className="col-4">
                            <IconButton className="p-link w-4rem h-2rem" onClick={() => _changeTheme('lara-light-indigo', 'light')}>
                                <LightModeIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton className="p-link w-4rem h-2rem" onClick={() => _changeTheme('lara-dark-indigo', 'dark')}>
                                <DarkModeIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    </div>

                    <h5>Escala</h5>
                    <div className="flex align-items-center">
                        <IconButton onClick={decrementScale} className="w-2rem h-2rem mr-2" disabled={layoutConfig.scale === scales[0]}>
                            <RemoveIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={incrementScale} className="w-2rem h-2rem ml-2" disabled={layoutConfig.scale === scales[scales.length - 1]}>
                            <AddIcon fontSize="inherit" />
                        </IconButton>
                    </div>

                    <h5>Tipo de menu</h5>
                    <div className="flex">
                        <div className="field-radiobutton flex-1">
                            <Radio name="menuMode" value="static" checked={layoutConfig.menuMode === 'static'} 
                                onChange={(e) => changeMenuMode(e)} id="mode1"></Radio>
                            <label htmlFor="mode1">Static</label>
                        </div>
                        <div className="field-radiobutton flex-1">
                            <Radio name="menuMode" value="overlay" checked={layoutConfig.menuMode === 'overlay'} 
                                onChange={(e) => changeMenuMode(e)} id="mode2"></Radio>
                            <label htmlFor="mode2">Overlay</label>
                        </div>
                    </div>

                    <h5>Estilo de entrada</h5>
                    <div className="flex">
                        <div className="field-radiobutton flex-1">
                            <Radio name="inputStyle" value="outlined" checked={layoutConfig.inputStyle === 'outlined'} 
                                onChange={(e) => changeInputStyle(e)} id="outlined_input"></Radio>
                            <label htmlFor="outlined_input">Outlined</label>
                        </div>
                        <div className="field-radiobutton flex-1">
                            <Radio name="inputStyle" value="filled" checked={layoutConfig.inputStyle === 'filled'} 
                                onChange={(e) => changeInputStyle(e)} id="filled_input"></Radio>
                            <label htmlFor="filled_input">Filled</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default AppConfig;
