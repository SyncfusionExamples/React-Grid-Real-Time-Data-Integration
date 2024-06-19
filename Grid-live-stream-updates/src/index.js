import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective} from '@syncfusion/ej2-react-grids';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { getTradeData } from './data';


function LiveStream() {
    // store the grid instance
    let grid;
    // start timer button
    let updateButton;
    // stop time button
    let clearButton;
    // time dalay 
    let feedDelayInput;
    // initiate the timer
    let timerID;
    // indicate the initial render
    let initial = true;
    const load = function (args) {
        this.on('data-ready', () => {
            if (initial) {
                document.getElementById('update1')?.click();
                initial = false;
                feedDelayInput.element.addEventListener('keypress', (e) => {
                    if (e && e.key === 'Enter' && feedDelayInput.element.parentElement.classList.contains('e-input-focus')) {
                        feedDelayInput.value = parseInt(feedDelayInput.element.value);
                        feedDelayInput.focusOut();
                        updateButton.element.click();
                    }
                });
            }
        });
        this.on('destroy', function () {
            if (timerID) {
                clearInterval(timerID);
                timerID = undefined;
            }
        });
    };
    const queryCellInfo = (args) => {
        if (args.column?.field === 'NetIncome') {
            if (args.data['Net'] < 0) {
                args.cell?.classList.remove('e-increase');
                args.cell?.classList.add('e-decrease');
            }
            else if (args.data['Net'] > 0) {
                args.cell?.classList.remove('e-decrease');
                args.cell?.classList.add('e-increase');
            }
        }
        else if (args.column?.field === 'Net') {
                if (args.data['Net'] < 0) {
                    updateCellDetails(args.cell, 'below-0');
                }
                else {
                    updateCellDetails(args.cell, 'above-0');
                }}

    };
    // dynamically append the span element with custom style
    const updateCellDetails = (cell, className) => {
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        span1.classList.add('rowcell-left');
        div.classList.add(className);
        span1.innerHTML = cell.innerHTML;
        cell.innerHTML = '';
        div.appendChild(span1);
        cell.appendChild(div);
    };

    // calculate the update the grid cell value
    const updateCellValues = () => {
        let oldValue;
        let newValue;
        for (let i = 0; grid && i < grid?.currentViewData.length; i++) {
            if (grid?.currentViewData[i] === undefined) {
                return;
            }
            let num = Math.floor(Math.random() * 99) + 1;
            num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
            oldValue = grid?.currentViewData[i]['Net'];
            if (i % 2 === 0) {
                num = num * 0.25;
            }
            else if (i % 3 === 0) {
                num = num * 0.83;
            }
            else if (i % 5 === 0) {
                num = num * 0.79;
            }
            else if (i % 4 === 0) {
                num = num * 0.42;
            }
            else {
                num = num * 0.51;
            }
            // dynamically update the grid cell value
            grid?.setCellValue(grid?.currentViewData[i]['id'], 'Net', parseFloat(num.toFixed(2)));
            newValue = parseFloat((grid?.currentViewData[i]['Net'] - oldValue).toString().substring(0, 2));
            const val = num + newValue;
            grid?.setCellValue(grid?.currentViewData[i]['id'], 'NetIncome', val);
        }
    };
    const data = getTradeData;
    const updateClick = () => {
        if (!timerID) {
            updateButton.disabled = true;
            feedDelayInput.enabled = false;
            clearButton.disabled = false;
            timerID = setInterval(updateCellValues, feedDelayInput.value);
        }
    };
    const clearClick = () => {
        if (timerID) {
            updateButton.disabled = false;
            feedDelayInput.enabled = true;
            clearButton.disabled = true;
            clearInterval(timerID);
            timerID = undefined;
        }
    };
    return (<div className='control-pane'>
            <div className='control-section-pane' style={{ marginLeft: '10px', marginRight:'10px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <h4 style={{ display: 'inline-block', fontSize: '14px', paddingLeft: '5px' }}>
                        Feed Delay(ms):
                    </h4>
                    <NumericTextBoxComponent format="N0" value={1000} min={10} max={5000} step={1} width={'150px'} style={{ marginLeft: '7px' }} ref={(scope) => {
            feedDelayInput = scope;
        }}/>
                    <ButtonComponent id="update1" ref={(scope) => {
            updateButton = scope;
        }} onClick={updateClick} style={{ marginLeft: '10px' }}>
                        Start Data Update
                    </ButtonComponent>
                    <ButtonComponent id="clear" ref={(scope) => {
            clearButton = scope;
        }} onClick={clearClick} style={{ marginLeft: '10px' }}>
                        Stop Data Update
                    </ButtonComponent>
                </div>
                <GridComponent id="livestream" dataSource={data} enableVirtualMaskRow={false} enableHover={false} rowHeight={38} height={400} ref={(g) => {
            grid = g;
        }} allowSelection={false} queryCellInfo={queryCellInfo} load={load}>
                    <ColumnsDirective>
                        <ColumnDirective field="id" headerText="ID" width="140" isPrimaryKey={true} visible={false}/>
                        <ColumnDirective field="CountryCode" headerText="Ticker" width="100"/>
                        <ColumnDirective field="Net" headerText="Net" width="100" format="C2" type="number" textAlign="Right"/>
                        <ColumnDirective field="NetIncome" headerText="Net Income" width="150" format="C2" type="number" textAlign="Right"/>
                        <ColumnDirective field="Sector" width="160" headerText="Sector"/>
                        <ColumnDirective field="EmployeeCount" width="130" headerText="Employee Count" textAlign="Right"/>
                    </ColumnsDirective>
                </GridComponent>
            </div>

        </div>);
}
export default LiveStream;

const root = createRoot(document.getElementById('sample'));
root.render(<LiveStream />);