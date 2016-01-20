/// <reference path='libs/jquery/jquery.d.ts' />
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='models/TodoItem.ts' />
/// <reference path='interfaces/ITodoScope.ts' />
/// <reference path='interfaces/ITodoStorage.ts' />
/// <reference path='directives/TodoFocus.ts' />
/// <reference path='directives/TodoBlur.ts' />
/// <reference path='services/TodoStorage.ts' />
/// <reference path='controllers/TodoCtrl.ts' />
/// <reference path='Application.ts' />
/// <reference path='ngIncompleteObjectFailingTestInput.d.ts' />

/**
 * No good incomplete object Rule test
 * no vauge object rule test
 */
/* tslint:disable:no-http-string */
/* tslint:disable:no-reserved-keywords */
module Samples {
    'use strict';
    interface Address1St {
        streetNumber: any;
        streetName?: string;
        city: String;
        StateShortName?: string;
        State: string;
        zipCode: string;
        country: string;
        filler1: any;
        yobi002: any;
        junc100?: any;
    }
    interface ShelfAddress {
        row: number;
        col: number;
        front?: boolean;
    }
    interface Address2St extends Address1St {
        townName: string;
        buildingName?: string;
        warehouseFloorName?: string;
        warehouseShelfAddress: ShelfAddress;
    }
    interface Address3USIn extends Address2St {
        streetNumber: number; // overrides
    }
    interface StreetNumberJP { // Japanease localized 
        tyoume: number;
        bannti: number;
        ku: number;
    }
    interface Address3JPIn extends Address2St {
        streetNumber: StreetNumberJP; // overrides
        itFill: Boolean;
    }
    interface Address3JPOut extends Address2St {
        streetNumber: string;
        itFill: string;
    }
    /* tslint:disable:no-constructor-vars */
    class Samples1Service {
        public static $inject = ['$log', '$http', 'RestResource'];
        private lastData;
        private $log;
        constructor(private $log: ng.ILogService, private httpRequester: ng.IRest, private restSvc: myOwn.IRest) {
        }

        private create(createinData: Address2St): void {
            var outData: Address2St = <Address2St>{};
            outData.country = createinData.country;
            outData.zipCode = createinData.zipCode;
            outData.State = createinData.State;
            outData.streetNumber = createinData.streetNumber;
            outData.townName = createinData.townName;
            this.httpRequester.post('http://registServer/warehouse/', <Address2St>outData); // error
            outData.warehouseShelfAddress = <ShelfAddress>{ col: 3 };
            outData.warehouseShelfAddress = createinData.warehouseShelfAddress;
            this.httpRequester.post('http://registServer/warehouse/', <Address2St>outData); // error
            outData.warehouseShelfAddress.row = 1;
            this.restSvc.postHttp('/warehouse/', <Address2St>outData) // ok
                .then((createResponce: IResponce) => {
                    this.lastData = <Address2St>createResponce.data;
                });
        }
        private read(inData: Address3JPIn): void {
            var outData: Address3JPOut = <Address3JPOut>{};
            if (inData.itFill) {
                outData.itFill = '1';
            } else { outData.itFill = '0'; }
            outData.streetNumber = inData.streetNumber; // to be complie error : string to streetNumberJP 
            outData.streetNumber = inData.streetNumber.bannti
                + (inData.streetNumber.bannti > 0 ? '-' + inData.streetNumber.bannti
                    + (inData.streetNumber.ku > 0 ? '-' + inData.streetNumber.ku : '')
                    : '');
            this.httpRequester.get('http://registServer/warehouse/', outData) //  NG outData.itFill ={|'1'|,|'0'|}
                .then((readResponce: IResponce) => {
                    this.lastData = <Address2St>(readResponce.data);
                });
        }
        private update(inData: Address3JPIn): void {
            var outData: Address3JPOut = <Address3JPOut>{};
            outData.itFill = (inData.itFill) ? '1' : '0'; // not Vauge value
            outData.yobi002 = 'Additional preliminary information';
            this.restSvc.put('/warehouse/', outData) // ok not Vauge
                .then((updateResponce: IResponce) => {
                    this.lastData = <Address2St>(updateResponce.data);
                    return gui.notify(this.lastData); // 
                });
        }
        private delete(): void {
            var outData = <Address3JPOut>{};
            outData = this.lastData;
            this.restSvc.delete('/warehouse/', outData); // NG this.lastData is vauge
        }
    }
}
