'use strict';

import types from './types';
import fetch from 'node-fetch';
import * as request from 'request-promise';
import * as vscode from 'vscode';

interface QuickItem {
    description: string;
    label: string;
    detail: string;
};

interface RawTypeDefinition {
	t: string;
	g: string[];
	m: string[];
	p: string;
	l: string;
	d: number;
};

const placeHolder = 'Search for Types Packages';
const typesURL = 'https://typespublisher.blob.core.windows.net/typespublisher/data/search-index-min.json';

async function onTypeSelected(selected: QuickItem): Promise<string> {
    const selection = await vscode.window.showInformationMessage(
        `Type ${selected.label} was selected. Select an installation command to copy to the clipboard`,
        ...['NPM','Yarn']);
    return selection;
}

async function fetchTypes(from: string): Promise<RawTypeDefinition[]> {
    // const response = await fetch(from, {
    //     compress: false,
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     }
    // });

    // const body = await response.json();
    // console.log(body);
    return Promise.resolve(types as RawTypeDefinition[]);
}

function typeToQuickItem(types: RawTypeDefinition[]): QuickItem[] {
    return types
    .map((type) => ({ description: type.l, label: type.t, detail: type.p } as QuickItem))
    .sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
}

async function onCommand(): Promise<void> {
    const types = await fetchTypes(typesURL);
    const selected = await vscode.window.showQuickPick(typeToQuickItem(types), { placeHolder });
    const copyCmd = await onTypeSelected(selected);
}

export function activate(context: vscode.ExtensionContext) {
    //console.log(vscode.workspace.getConfiguration('editor').get('fontFamily'));
    const searchTypeSearch = vscode.commands.registerCommand('extension.typesearch', onCommand);
    context.subscriptions.push(searchTypeSearch);
}

export function deactivate() { }