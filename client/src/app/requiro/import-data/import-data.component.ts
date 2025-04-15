import { Component, OnInit } from "@angular/core";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { ResultCode, ResultWithData } from "../../../../../datatypes/result";
import { ImportDataService } from "../services/import-data.service";
import { ReportsService } from "../services/reports.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "import-data",
  templateUrl: "./import-data.component.html",
  styleUrls: ["./import-data.component.scss"],
})
export class ImportDataComponent implements OnInit {
  result: any;
  error: any;

  allowedExtensions: Array<string> = ["csv"];
  fileLoaded: File;
  // campaignChangeFile: File;
  // campaignQueueChangeFile: File;
  // queueChangeFile: File;

  constructor(
    private importService: ImportDataService,
    private reportService: ReportsService
  ) {}

  ngOnInit() {}

  processResponse(response: ResultWithData<any[]>) {
    if (response.result === ResultCode.OK) {
      console.log(response);
      this.result = JSON.stringify(response);
    } else {
      console.error(response);
      this.error = JSON.stringify(response);
    }
  }

  processError(error: any) {
    console.error(error);
    this.error = JSON.stringify(error);
  }

  fileCampaignChangeLoaded(file: File) {
    console.log("fileCampaignChangeLoaded");
    this.fileLoaded = file;
    // this.onFileLoaded.emit(file);
    // this.loadedFile = file;
    // this.editAll = true;
  }

  // fileCampaignQueueChangeLoaded(file: File) {
  //   console.log('fileCampaignQueueChangeLoaded');
  //   this.campaignQueueChangeFile = file;
  //   console.log(this.campaignQueueChangeFile);
  //   // this.onFileLoaded.emit(file);
  //   // this.loadedFile = file;
  //   // this.editAll = true;
  // }

  // fileQueueChangeLoaded(file: File) {
  //   console.log('fileQueueChangeLoaded');
  //   this.queueChangeFile = file;
  //   console.log(this.queueChangeFile, '>>>>>');
  //   // this.onFileLoaded.emit(file);
  //   // this.loadedFile = file;
  //   // this.editAll = true;
  // }

  changeCampaign() {
    if (this.fileLoaded) {
      this.importService.changeCampaign(this.fileLoaded).subscribe((result) => {
        this.fileLoaded = null;
        console.log(result);
      });
    }
  }

  changeQueue() {
    console.log(this.fileLoaded);
    if (this.fileLoaded) {
      this.importService.changeQueue(this.fileLoaded).subscribe((result) => {
        this.fileLoaded = null;
        console.log(result);
      });
    }
  }

  changeCampaignQueue() {
    console.log(this.fileLoaded);
    if (this.fileLoaded) {
      this.importService
        .changeCampaignAndQueue(this.fileLoaded)
        .subscribe((result) => {
          this.fileLoaded = null;
          console.log(result);
        });
    }
  }

  showErrors(errors: any[]) {
    // this.onErrors.emit(errors);
  }

  lastEventForAll(): void {
    this.reportService.lastEventForAll().subscribe((response) => {
      console.log(response.data);
      const report: any[] = response.data;
      report.forEach((item) => {
        console.log(item);
      });
      this.exportCSV(report);
    });
  }

  deleteOldCustomerCampaigns(): void {
    this.reportService.deleteOldCustomerCampaigns().subscribe((response) => {
      console.log(response.data);
    });
  }

  exportCSV(report): void {
    const options = {
      fieldSeparator: ";",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
    };

    const data = new Array<{
      agent: string;
      campaign: string;
      ci: string;
      lastDate: string;
      result: string;
      phone: string;
    }>();
    data.push({
      agent: "Agente",
      campaign: "Campaña",
      ci: "CI",
      lastDate: "Fecha",
      result: "Resultado",
      phone: "Telefono",
    });

    for (let i = 0; i < report.length; i++) {
      const line = report[i];
      const d = new Date(line.lastDate);
      data.push({
        agent: line.agent,
        campaign: line.campaign,
        ci: line.ci,
        lastDate:
          d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
        result: line.result,
        phone: line.phone,
      });
    }
    //
    new Angular5Csv(data, "Ultimos eventos", options);
  }
}
