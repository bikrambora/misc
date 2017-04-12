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

function onTypeSelected(selected: QuickItem): void {
    console.log(selected);
}

function typeToQuickItem(types: RawTypeDefinition[]): QuickItem[] {
    return types
    .map((type) => ({ description: type.l, label: type.t, detail: type.p } as QuickItem))
    .sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
}

async function onCommand(): Promise<void> {
    const selected = await vscode.window.showQuickPick(typeToQuickItem(types), { placeHolder });
    onTypeSelected(selected);
}

export function activate(context: vscode.ExtensionContext) {
    //console.log(vscode.workspace.getConfiguration('editor').get('fontFamily'));
    const searchTypeSearch = vscode.commands.registerCommand('extension.typesearch', onCommand);
    context.subscriptions.push(searchTypeSearch);
}

export function deactivate() { }