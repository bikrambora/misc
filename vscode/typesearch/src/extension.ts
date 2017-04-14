'use strict';

//import types from './types';
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

let cache: vscode.Memento;
const placeHolder = 'Search for Types Packages';
const typesURL = 'https://typespublisher.blob.core.windows.net/typespublisher/data/search-index-min.json';

async function onTypeSelected(selected: QuickItem): Promise<string> {
    const selection = await vscode.window.showInformationMessage(
        `Type ${selected.label} was selected. Select an installation command to copy to the clipboard`,
        ...['NPM','Yarn']);
    const cmd = selection === 'NPM' ? `npm install @types/${selected.label} --save-dev` : `yarn add @types/${selected.label} --dev`;
    return await vscode.window.showInformationMessage(cmd);
}

async function fetchTypes(from: string): Promise<RawTypeDefinition[]> {
    const types = cache.get('typesearch.types') as RawTypeDefinition[];
    if(types) return types;

    try {
        const response = await request({ url: from, gzip: true });
        const fetchedTypes = JSON.parse(response) as RawTypeDefinition[];
        await cache.update('typesearch.types', fetchedTypes);
        return fetchedTypes;   
    } catch (error) {
        return Promise.reject('Could not fetch types. Make sure you are connected to the internet');
    }    
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
    cache = context.globalState;
    const searchTypeSearch = vscode.commands.registerCommand('extension.typesearch', onCommand);
    context.subscriptions.push(searchTypeSearch);
}

export function deactivate() { }