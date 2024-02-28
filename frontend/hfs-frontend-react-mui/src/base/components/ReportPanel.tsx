import React from "react";
import { PDFReport, ReportService, SelectItemGroup } from "../services/ReportService";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListSubheader from "@mui/material/ListSubheader";
import Grid from '@mui/material/Grid';
import Checkbox from "@mui/material/Checkbox";

interface ReportPanelProps {
  typeReportChange?(e: SelectChangeEvent): void,
  forceDownloadChange?(e: React.ChangeEvent<HTMLInputElement>): void
}

class ReportPanelComponent extends React.Component<ReportPanelProps,any> {

  private reportService: ReportService;  
  private lista: React.JSX.Element[] = [];

  constructor(props: ReportPanelProps) {
    super(props);
    this.reportService = new ReportService();

    this.state = {
      typeReport: this.reportService.getTypeReport(),
      selectedTypeReport: PDFReport,
      selectedForceDownload: true
    }

    this.state.typeReport.forEach((group: SelectItemGroup) => {
        this.lista.push(<ListSubheader key={group.id} style={{fontWeight: "bold"}}>{group.label}</ListSubheader>);        
        group.items?.forEach((item: SelectItemGroup) => {
          this.lista.push(<MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>);  
        });
    });

  }

  private typeReportChange(e: SelectChangeEvent): void {
    this.setState({ selectedTypeReport: e.target.value });

    if (this.props.typeReportChange) {
      this.props.typeReportChange(e);
    }
  }

  private forceDownloadChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ selectedForceDownload: e.target.checked });

    if (this.props.forceDownloadChange) {
      this.props.forceDownloadChange(e);
    }
  }

  render() {
    return (
      <Grid container spacing={30}>
        <Grid item xs={6}>
            <FormControl sx={{ m: 1, minWidth: 400 }}>
              <InputLabel htmlFor="cmbTypeReport">Escolha o tipo de relatório:</InputLabel>
              <Select value={this.state.selectedTypeReport} id="cmbTypeReport" label="Grouping" onChange={e => this.typeReportChange(e)} >
                {this.lista}
              </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6}>
            <InputLabel htmlFor="forceDownload">Forçar download:</InputLabel>
            <Checkbox id="forceDownload" onChange={e => this.forceDownloadChange(e)} 
                  checked={this.state.selectedForceDownload}></Checkbox>      
        </Grid>
      </Grid>
    );
  }
}

export default ReportPanelComponent;