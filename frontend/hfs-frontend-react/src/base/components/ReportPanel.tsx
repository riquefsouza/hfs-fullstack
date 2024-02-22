import React from "react";
import { PDFReport, ReportService } from "../services/ReportService";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { CheckboxChangeEvent } from 'primereact/checkbox';

interface ReportPanelProps {
  typeReportChange?(e: DropdownChangeEvent): void,
  forceDownloadChange?(e: CheckboxChangeEvent): void
}

class ReportPanelComponent extends React.Component<ReportPanelProps,any> {

  private reportService: ReportService;

  constructor(props: ReportPanelProps) {
    super(props);
    this.reportService = new ReportService();

    this.state = {
      typeReport: this.reportService.getTypeReport(),
      selectedTypeReport: PDFReport,
      selectedForceDownload: true
    }
  }

  private typeReportChange(e: DropdownChangeEvent): void {
    this.setState({ selectedTypeReport: e.value });

    if (this.props.typeReportChange) {
      this.props.typeReportChange(e);
    }
  }
/*
  private forceDownloadChange(e: CheckboxChangeEvent): void {
    this.setState({ selectedForceDownload: e.checked });

    if (this.props.forceDownloadChange) {
      this.props.forceDownloadChange(e);
    }
  }
  */
  render() {
    return (
      <div className="p-fluid formgrid grid">
          <div className="field col-4 md-4">
              <label htmlFor="cmbTypeReport">Escolha o tipo de relatório:</label>
              <Dropdown value={this.state.selectedTypeReport} options={this.state.typeReport} 
                  onChange={e => this.typeReportChange(e)} 
                  optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" />
          </div>
          {/*
          <div className="field col-4 md-4">
              <label htmlFor="forceDownload" style={{margin: '4px'}}>Forçar download:</label>
              <Checkbox id="forceDownload" onChange={e => this.forceDownloadChange(e)} 
                  checked={this.state.selectedForceDownload}></Checkbox>
          </div>
          */}
      </div>
    );
  }
}

export default ReportPanelComponent;