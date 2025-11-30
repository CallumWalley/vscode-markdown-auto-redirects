import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { minimatch } from "minimatch";

export function activate(context: vscode.ExtensionContext) {

    vscode.window.showErrorMessage(
        `PAAAIIIIIIIIINNNNN`
    );
    const disposable = vscode.workspace.onDidRenameFiles(async (event) => {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            return;
        }

        // Get Markdown's built-in include patterns
        const mdConfig = vscode.workspace.getConfiguration("markdown");
        const includePatterns = mdConfig.get<string[]>("updateLinksOnFileMove.include") ?? [];

        // Get extension settings
        const config = vscode.workspace.getConfiguration("markdownAutoRedirects");
        const mapFile = config.get<string>("mapFile") ?? "";
        const relativeTo = config.get<string>("relativeTo") ?? "";

        const mapFilePath = path.join(workspaceRoot, mapFile);

        const entries: string[] = [];

        // Match only moved files that fit the pattern
        for (const f of event.files) {
            const relOld = path.relative(workspaceRoot, f.oldUri.fsPath);
            const relNew = path.relative(workspaceRoot, f.newUri.fsPath);

            const matches = includePatterns.some(
                p => minimatch(relOld, p) || minimatch(relNew, p)
            );

            if (matches) {
                entries.push(`${path.relative(relativeTo, relOld)} : ${path.relative(relativeTo, relNew)}`);
            }
        }

        if (entries.length === 0) {
            return;
        }

        // Prompt user if map file does not exist
        if (!fs.existsSync(mapFilePath)) {
            const answer = await vscode.window.showWarningMessage(
                `The redirect map file "${mapFile}" does not exist. Create it?`,
                { modal: true },
                "Create"
            );

            if (answer !== "Create") {
                return;
            }

            try {
                fs.mkdirSync(path.dirname(mapFilePath), { recursive: true });
                fs.writeFileSync(mapFilePath, "");
            } catch (err) {
                vscode.window.showErrorMessage(
                    `Failed to create redirect map file: ${mapFile}`
                );
                console.error(err);
                return;
            }
        }

        // Append entries
        try {
            fs.appendFileSync(mapFilePath, entries.join("\n") + "\n");
        } catch (err) {
            vscode.window.showErrorMessage(
                `Failed to write to redirect map file: ${mapFile}`
            );
            console.error(err);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
