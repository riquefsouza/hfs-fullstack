import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItemGroup } from 'primeng/api';
import { Subject } from 'rxjs';
import { ItypeReport, PDFReport, ReportService } from '../../services/ReportService';

@Component({
  selector: 'app-report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.css'],
  providers: [ReportService]
})
export class ReportPanelComponent implements OnInit {

  typeReport: SelectItemGroup[];

  selectedTypeReport: ItypeReport;

  selectedForceDownload: boolean;

  @Output() typeReportChange = new EventEmitter<ItypeReport>();
  typeReportChangedSource = new Subject<ItypeReport>();

  @Output() forceDownloadChange = new EventEmitter<boolean>();
  forceDownloadChangedSource = new Subject<boolean>();

  constructor(private reportService: ReportService) {
    this.typeReport = this.reportService.getTypeReport();
    this.selectedTypeReport = PDFReport;
    this.selectedForceDownload = true;
  }

  ngOnInit(): void {
    this.typeReportChangedSource.subscribe(item => this.typeReportChange.emit(item));
    this.forceDownloadChangedSource.subscribe(item => this.forceDownloadChange.emit(item));
  }

  ngOnDestroy() {
    this.typeReportChangedSource.unsubscribe();
    this.forceDownloadChangedSource.unsubscribe();
  }

}
