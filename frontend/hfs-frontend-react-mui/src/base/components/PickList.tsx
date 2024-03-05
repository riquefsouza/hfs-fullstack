import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { Entidade } from "../models/Entidade";
import { Card, CardContent, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

interface PickListProps<T extends Entidade> {
  source: T[];
  target: T[];
}

const PickListComponent = <T extends Entidade>(props: PickListProps<T>) => {

  const [sourceLista, setSourceLista] = useState<T[]>([]);
  const [targetLista, setTargetLista] = useState<T[]>([]);
  const [sourceChecked, setSourceChecked] = useState<number[]>([]);
  const [targetChecked, setTargetChecked] = useState<number[]>([]);
  const [sourceSelected, setSourceSelected] = useState<T[]>([]);
  const [targetSelected, setTargetSelected] = useState<T[]>([]);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    setSourceLista(props.source);
    setTargetLista(props.target);
  });
  
  const findIndexById = (lista: T[], id: number): number => {
    let index = -1;
    for (let i = 0; i < lista.length; i++) {

      if (lista[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  const sourceHandleToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const currentIndex = sourceChecked.indexOf(index);
    const newChecked = [...sourceChecked];
    const newSourceSelected = [...sourceSelected];

    if (currentIndex === -1) {
      newChecked.push(index);
      newSourceSelected.push(sourceLista[index]);
    } else {
      newChecked.splice(currentIndex, 1);
      newSourceSelected.splice(currentIndex, 1);
    }

    setSourceChecked(newChecked);
    setSourceSelected(newSourceSelected);
  };  

  const targetHandleToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const currentIndex = targetChecked.indexOf(index);
    const newChecked = [...targetChecked];
    const newSourceSelected = [...targetSelected];

    if (currentIndex === -1) {
      newChecked.push(index);
      newSourceSelected.push(targetLista[index]);
    } else {
      newChecked.splice(currentIndex, 1);
      newSourceSelected.splice(currentIndex, 1);
    }

    setTargetChecked(newChecked);
    setTargetSelected(newSourceSelected);
  };  

  const addTarget = () => {
    if (sourceSelected.length > 0) {
      sourceSelected.forEach(item => {
        targetLista.push(item);

        if (item.id){
          let index = findIndexById(sourceLista, item.id);
          sourceLista.splice(index, 1);  
        }
      });

      setSourceChecked([]);
      setSourceSelected([]);
  
      forceUpdate();
    }  
  }

  const addAllTarget = () => {
    sourceLista.forEach((item: T) => {
      targetLista.push(item);
    });
    sourceLista.splice(0, sourceLista.length);
    setSourceChecked([]);
    setSourceSelected([]);

    forceUpdate();
  }

  const addSource = () => {
    if (targetSelected.length > 0) {
      targetSelected.forEach(item => {
        sourceLista.push(item);

        if (item.id){
          let index = findIndexById(targetLista, item.id);
          targetLista.splice(index, 1);
        }
      });
      setTargetChecked([]);
      setTargetSelected([]);

      forceUpdate();
    }
  }

  const addAllSource = () => {
    targetLista.forEach((item: T) => {
      sourceLista.push(item);
    });
    targetLista.splice(0, targetLista.length);
    setTargetChecked([]);
    setTargetSelected([]);

    forceUpdate();
  }

  const verticalButtons = {
    display: "block",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };
  
  return (    
    <Grid container spacing={0} direction="row" justifyContent="center" alignItems="stretch">
      <Grid item xs={5}>

        <Card sx={{ width: "100%", height: "100%" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "medium" }}>Disponível</Typography>
          <CardContent sx={{ borderStyle: "solid", borderWidth: "1px", borderRadius: "10px", width: "100%", height: "300px" }}>
            <List component="nav" aria-label="Disponível" sx={{ overflow: "auto",  height: "270px" }}>

              {sourceLista.map((item: T, index: number) => {
                return <ListItem key={index} disablePadding>
                  <ListItemButton role={undefined} onClick={(event) => sourceHandleToggle(event, index)} dense>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={sourceChecked.indexOf(index) !== -1} tabIndex={-1} disableRipple 
                        inputProps={{ 'aria-labelledby': index.toString() }} />
                    </ListItemIcon>
                    <ListItemText id={index.toString()} primary={item.description} />
                  </ListItemButton>
                </ListItem>;
              })}

            </List>
          </CardContent>
        </Card>

      </Grid>
      <Grid item xs={2}>

        <IconButton type="button" style={verticalButtons} color="primary" onClick={addTarget}>
          <KeyboardArrowRightIcon fontSize="inherit" />
        </IconButton>
        <IconButton type="button" style={verticalButtons} color="primary" onClick={addAllTarget}>
          <KeyboardDoubleArrowRightIcon fontSize="inherit" />
        </IconButton>
        <IconButton type="button" style={verticalButtons} color="primary" onClick={addSource}>
          <KeyboardArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <IconButton type="button" style={verticalButtons} color="primary" onClick={addAllSource}>
          <KeyboardDoubleArrowLeftIcon fontSize="inherit" />
        </IconButton>

      </Grid>
      <Grid item xs={5}>

        <Card sx={{ width: "100%", height: "100%" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "medium" }}>Selecionada</Typography>
          <CardContent sx={{ borderStyle: "solid", borderWidth: "1px", borderRadius: "10px", width: "100%", height: "300px" }}>
            <List component="nav" aria-label="Selecionada" sx={{ overflow: "auto",  height: "270px" }}>

              {targetLista.map((item: T, index: number) => {
                return <ListItem key={index} disablePadding>
                  <ListItemButton role={undefined} onClick={(event) => targetHandleToggle(event, index)} dense>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={targetChecked.indexOf(index) !== -1} tabIndex={-1} disableRipple 
                        inputProps={{ 'aria-labelledby': index.toString() }} />
                    </ListItemIcon>
                    <ListItemText id={index.toString()} primary={item.description} />
                  </ListItemButton>
                </ListItem>;
              })}

            </List>
          </CardContent>
        </Card>

      </Grid>
    </Grid>
  );
  
};

export default PickListComponent;