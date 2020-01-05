import { AxiosResponse } from 'axios';
import { TreeDataProvider, TreeItem, ExtensionContext, TreeItemCollapsibleState } from "vscode";
import { CapNode } from "./capNode";
import { CaproverCliService } from '../services/caprovercli.service';
import * as vscode from 'vscode';
import { ContextHelper } from '../services/context.helper';
import { Machine } from './machine';
import { initMachine } from '../procedure/initmachine.procedure';

export class CapNodeProvider implements TreeDataProvider<any> {

	// capcliService: CaproverCliService;
	// context: vscode.ExtensionContext;
	contextHelper: ContextHelper;

	constructor(context: vscode.ExtensionContext) {

		this.contextHelper = ContextHelper.getInstance();

		// this.capcliService = CaproverCliService.getInstance();
		// this.context = context;
	}

	public async getChildren(task?: CapNode): Promise<CapNode[]> {
		let childrens: CapNode[] = [];
		if (task === undefined) {
			childrens = await this.getMachine();
		} else {
			childrens = await this.getServerChildren(task);
		}
		return childrens;
	}


	private async getMachine() {

		const machines = this.contextHelper.getObjectsFromArrayKey(ContextHelper.MACHINE_KEY_ARRAY) as Machine[];

		const mNodes: CapNode[] = [];
		for (let m of machines) {
			mNodes.push(new CapNode('server', m.name, TreeItemCollapsibleState.Collapsed, m));
		}

		return mNodes;
	}

	private async getServerChildren(mNode: CapNode) {


		const appsDefData = await initMachine(mNode.metaData as Machine);

		if(!appsDefData){
			throw new Error("Unable to get machine's app definitions");
		}

		const apps: CapNode[] = [];
	

		for (let a of appsDefData.appDefinitions) {
			apps.push(new CapNode('app', a.appName, TreeItemCollapsibleState.None, a));
		}


		return apps;
	}


	getTreeItem(task: CapNode): CapNode {
		return task;
	}
}