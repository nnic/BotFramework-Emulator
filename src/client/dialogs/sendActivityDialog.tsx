//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import * as React from 'react';
import { remote } from 'electron';
import { getSettings, Settings, addSettingsListener } from '../settings';
import { Settings as ServerSettings } from '../../types/serverSettingsTypes';
import { IGenericActivity } from '../../types/activityTypes';
import { AddressBarActions, ConversationActions, ServerSettingsActions } from '../reducers';
import { IBot, newBot } from '../../types/botTypes';
import * as log from '../log';
import * as path from 'path';
import * as Constants from '../constants';

const emulator_1 = require("../emulator");

export class SendActivityDialog extends React.Component<{}, {}> {
    settingsUnsubscribe: any;
    ngrokPathInputRef: any;
    bypassNgrokLocalhostInputRef: any;
    showing: boolean;

    activityType: any;
    activityValue: any;
    activityName: any;
    activityFromId : any;

    pageClicked = (ev: Event) => {
        if (ev.defaultPrevented)
            return;
        let target = ev.srcElement;
        while (target) {
            if (target.className.toString().includes("sendactivity")) {
                return;
            }
            target = target.parentElement;
        }

        // Click was outside the dialog. Close.
        this.onClose();
    }

    onAccept = () => {
        let activity : IGenericActivity = { type : this.activityType.value, name : this.activityName.value, value : this.activityValue.value };
        emulator_1.Emulator.sendActivity(activity);
        AddressBarActions.hideSendActivity();
    }

    onClose = () => {
        AddressBarActions.hideSendActivity();
    }

    componentWillMount() {
        window.addEventListener('click', this.pageClicked);
        this.settingsUnsubscribe = addSettingsListener((settings: Settings) => {
            if (settings.addressBar.showSendActivity != this.showing) {
                this.showing = settings.addressBar.showSendActivity;
                this.forceUpdate();
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.pageClicked);
        this.settingsUnsubscribe();
    }

    render() {
        const settings = getSettings();
        if (!settings.addressBar.showSendActivity) return null;
        const serverSettings = getSettings().serverSettings;
        return (
            <div>
                <div className="dialog-background">
                </div>
                <div className="emu-dialog sendactivity-dialog">
                    <h2 className="dialog-header">Send Direct Line Activity</h2>
                    <div className="dialog-closex" onClick={() => this.onClose()} dangerouslySetInnerHTML={{ __html: Constants.clearCloseIcon("", 24) }} />
                    <div className="sendactivity-lowerpane">
                        <div className={"emu-tab emu-visible"}>
                            <div className="input-group">
                                <label className="form-label">
                                    Type:
                                </label>
                                <input
                                    type="text"
                                    ref={ref => this.activityType = ref}
                                    className="form-input sendactivity-path-input sendactivity-ngrokpath-input" 
                                    defaultValue={`${this.activityType || ''}`}/>
                            </div>
                             <div className="input-group">
                                <label className="form-label">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    ref={ref => this.activityName = ref}
                                    className="form-input sendactivity-path-input sendactivity-ngrokpath-input"
                                    defaultValue={`${this.activityName || ''}`} />
                            </div>
                             <div className="input-group">
                                <label className="form-label">
                                    Value:
                                </label>
                                <input
                                    type="text"
                                    ref={ref => this.activityValue = ref}
                                    className="form-input sendactivity-path-input sendactivity-ngrokpath-input"
                                    defaultValue={`${this.activityValue || ''}`} />
                            </div>
                        </div>
                    </div>
                    <div className="dialog-buttons">
                        <button className="sendactivity-sendbtn" onClick={() => this.onAccept()}>Send</button>
                        &nbsp;&nbsp;&nbsp;
                        <button className="sendactivity-cancelbtn" onClick={() => this.onClose()}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
