import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import {execute} from '../command.js';

export const GeneralSettings = GObject.registerClass({
    GTypeName: 'GeneralSettings',
    Template: GLib.uri_resolve_relative(import.meta.url, '../../resources/ui/settings_general.ui', GLib.UriFlags.NONE),
    InternalChildren: [
        'activate_on_login',
        'show_icon',
        'enable_airplay',
        'enable_rtp_streaming',
        'enable_rtp_receiving'
    ],
}, class GeneralSettings extends Adw.PreferencesPage {
    constructor(settings) {
        super({});

        this.settings = settings;
        
        this.settings.bind('activate-on-login', this._activate_on_login, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.settings.bind('show-icon', this._show_icon, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.settings.bind('enable-airplay', this._enable_airplay, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.settings.bind('enable-rtp-streaming', this._enable_rtp_streaming, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.settings.bind('enable-rtp-receiving', this._enable_rtp_receiving, 'active', Gio.SettingsBindFlags.DEFAULT);

        this.settings.connect('changed::enable-rtp-receiving', () => {
            if (this.settings.get_boolean('enable-rtp-receiving')) {
                const fetchIpAttempt = execute('sh -c "hostname -I | awk \'{print $1}\'"');
                if (fetchIpAttempt.wasSuccessful) {
                    this._enable_rtp_receiving.set_subtitle(`Verfügbar unter ${fetchIpAttempt.result.trim()}`);
                }
            } else {
                this._enable_rtp_receiving.set_subtitle('');
            }
        });

        if (this.settings.get_boolean('enable-rtp-receiving')) {
            const fetchIpAttempt = execute('sh -c "hostname -I | awk \'{print $1}\'"');
            if (fetchIpAttempt.wasSuccessful) {
                this._enable_rtp_receiving.set_subtitle(`Verfügbar unter ${fetchIpAttempt.result.trim()}`);
            }
        }
    }
});
