import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'app/AppRoutes';
import { UtilitiesService } from 'app/services/utilitiesService';
import moment from 'moment';
import { DashboardService } from 'app/services/dashboard/dashboard.service';
import { FuseConfigService } from '@fuse/services/config';
import { ContractStatus } from 'app/contractStatus';
@Component({
    selector: 'app-merchant-dashboard',
    templateUrl: './merchant-dashboard.component.html',
    styleUrls: ['./merchant-dashboard.component.scss'],
})
export class MerchantDashboardComponent implements OnInit {
    single: any[];
    multi: any[];
    dashboard: any;
    view: any[] = [900, 400];
    contactGraph: any;
    isGrahpReady: boolean = false;
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Months';
    showYAxisLabel = true;
    yAxisLabel = 'Amount';

    yearList = [];

    colorScheme = {
        domain: [
            '#e6194b',
            '#3cb44b',
            '#ffe119',
            '#4363d8',
            '#f58231',
            '#911eb4',
            '#46f0f0',
            '#f032e6',
            '#bcf60c',
            '#fabebe',
            '#008080',
            '#e6beff',
        ],
    };
    contractStatus = ContractStatus;
    data: any;
    chart: any;
    payoutSelectedYear: any;
    contractSelectedYear: any;
    constructor(
        private route: Router,
        public utilitiesService: UtilitiesService,
        private dashboardService: DashboardService,
        private test: FuseConfigService
    ) {}

    public get getUrl(): typeof AppRoutes {
        return AppRoutes;
    }

    private _prepareChartData(): void {
        this.yearList = this.utilitiesService.getYearsList(5);
        // Github issues
        this.chart = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: true,
                },
                zoom: {
                    enabled: false,
                },
                xAxisName: 'Month',
                yAxisName: 'Count',
            },
            colors: ['#ee9e1e', '#3730a37a'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0,
                },

            },
            grid: {
                borderColor: 'var(--fuse-border)',
            },
            labels: ["Pending","Approved"],
            legend: {
                show: true,
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            series: [],
            // states: {
            //     hover: {
            //         filter: {
            //             type: 'darken',
            //             value: 0.75,
            //         },
            //     },
            // },
            stroke: {
                width: [3, 0],
            },
            tooltip: {
                followCursor: true,
                theme: 'dark',
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: 'var(--fuse-border)',
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip: {
                    enabled: true,
                },
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
            },
        };
    }
    gotoView(url, type?) {
        this.route.navigate([url], {
            queryParams: {
                type: type,
            },
        });
    }
    ngOnInit(): void {
        this.payoutSelectedYear = new Date().getFullYear();
        this.contractSelectedYear = new Date().getFullYear();
        this._prepareChartData();
        this.getDashboard();
    }
    async payoutYearChange() {
        await this.getDashboard(this.payoutSelectedYear);
    }
    async contractYearChange() {
        await this.getDashboard('', this.contractSelectedYear);
    }
    async getDashboard(payoutYear = '', contractYear = '') {
        try {
            this.utilitiesService.startLoader();
            let payoutReport = [];
            let labels = [];
            let contract_graph = [];
            const dashboard = await this.dashboardService
                .getDashboard(payoutYear, contractYear)
                .toPromise();
            if (dashboard) {
                this.utilitiesService.stopLoader();
                this.dashboard = dashboard;
                let contract = dashboard.contract_graph;
                for (const property in dashboard.payout_graph) {
                    payoutReport.push({
                        name: property,
                        value: dashboard.payout_graph[property].total_amount
                            ? dashboard.payout_graph[property].total_amount
                            : 0,
                    });
                }
                let newData = [];
                let closedData = [];
                for (const pro in contract) {
                    labels.push(pro);
                    for (const sub_pro in contract[pro]) {
                        if (sub_pro == 'new') {
                            newData.push(contract[pro][sub_pro]);
                        }
                        if (sub_pro == 'closed') {
                            closedData.push(contract[pro][sub_pro]);
                        }
                    }
                }
                contract_graph.push(
                    {
                        name: 'Pending',
                        type: 'line',
                        data: newData,
                    },
                    {
                        name: 'Settled',
                        type: 'column',
                        data: closedData,
                    }
                );
                this.contactGraph = {
                    labels: [...labels],
                    series: contract_graph,
                };
                console.log(this.contactGraph);
                this.contactGraph = this.contactGraph;
                this.isGrahpReady = true;
                this.single = [...payoutReport];
            }
        } catch {
        } finally {
        }
    }
}
