'use strict';

import types from './types';
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

function onTypeSelected(selected) {
    const item = selected as QuickItem;
    console.log(item);
}

function typesToItems(types: RawTypeDefinition[]) : QuickItem[] {
    return types
    .map((type) => ({ description: type.l, label: type.t, detail: type.p } as QuickItem))
    .sort((a, b) => {
        if(a.label < b.label) return -1;
        if(a.label > b.label) return 1;
        return 0;
    });
}

async function onCommand() {
    const selected = await vscode.window.showQuickPick(typesToItems(types), { placeHolder });
    onTypeSelected(selected);
}

export function activate(context: vscode.ExtensionContext) {
    const searchTypeSearch = vscode.commands.registerCommand('extension.typesearch', onCommand);
    context.subscriptions.push(searchTypeSearch);
}

export function deactivate() { }