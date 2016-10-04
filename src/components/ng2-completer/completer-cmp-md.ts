"use strict";
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { CtrCompleter } from "../../directives/ctr-completer";
import { CompleterData } from "./services/completer-data";
import { CompleterItem } from "./completer-item";
import { MAX_CHARS, MIN_SEARCH_LENGTH, PAUSE, TEXT_SEARCHING, TEXT_NORESULTS } from "../../globals";


import "rxjs/add/operator/catch";


const noop = () => { };

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompleterCmpMd),
    multi: true
};


@Component({
    selector: "ng2-completer-md",
    templateUrl: "./completer-cmp-md.html",
    styleUrls: ["./completer-cmp-md.css"],
    providers: [COMPLETER_CONTROL_VALUE_ACCESSOR]
})
export class CompleterCmpMd implements OnInit, ControlValueAccessor {
    @Input() public dataService: CompleterData;
    @Input() public inputName = "";
    @Input() public pause = PAUSE;
    @Input() public minSearchLength = MIN_SEARCH_LENGTH;
    @Input() public maxChars = MAX_CHARS;
    @Input() public overrideSuggested = false;
    @Input() public clearSelected = false;
    @Input() public placeholder = "";
    @Input() public matchClass: string;
    @Input() public textSearching = TEXT_SEARCHING;
    @Input() public textNoResults = TEXT_NORESULTS;
    @Input() public fieldTabindex: number;
    @Input() public autoMatch = false;
    @Input() public disableInput = false;
    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();

    @ViewChild(CtrCompleter) private completer: CtrCompleter;

    private displaySearching = true;
    private searchStr = "";
    private _onTouchedCallback: () => void = noop;
    private _onChangeCallback: (_: any) => void = noop;

    constructor() { }

    get value(): any { return this.searchStr; };

    set value(v: any) {
        if (v !== this.searchStr) {
            this.searchStr = v;
            this._onChangeCallback(v);
        }
    }

    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(value: any) {
        this.searchStr = value;
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    public ngOnInit() {
        this.completer.selected.subscribe((item: CompleterItem) => {
             this.selected.emit(item);
             this._onChangeCallback(item.title);
        });
        this.completer.highlighted.subscribe((item: CompleterItem) => {
             this.highlighted.emit(item);
        });

        if (this.textSearching === "false") {
            this.displaySearching = false;
        }
    }
}
