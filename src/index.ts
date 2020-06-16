import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { linkIcon } from '@jupyterlab/ui-components';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { PageConfig, URLExt } from '@jupyterlab/coreutils';
import { toArray } from '@lumino/algorithm';
import { Clipboard } from '@jupyterlab/apputils';

const shareFilePlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab/filebrowser-extension:gen-share-file',
  requires: [IFileBrowserFactory],
  activate: activateGenLink,
  autoStart: true
};

function activateGenLink(
  app: JupyterFrontEnd,
  factory: IFileBrowserFactory
  ): void {
  const { commands } = app;
  const { tracker } = factory;
  
  console.log(`Gen Appmode Command has been activated.`);
  const commandId = 'filebrowser:gen-share-main';
  commands.addCommand(commandId, {
    execute: (args: any) => {
      const widget = tracker.currentWidget;
      if (!widget) {
        return;
      }
      const path = encodeURI(widget.selectedItems().next().path);
      console.log(`Gen Appmode Command path ${path}.`);
      if (path.endsWith('.ipynb') !== true) {
        window.alert(`Warning file must be jupyter notebook file.`);
        return;
      }
      // following are components of url that are replaced
      // to generate appmode urls...
      const token1 = 'user-redirect';
      const token2 = 'lab/tree';
      const user = 'user/jhubprod';
      const node = 'apps';
      const attr = '?appmode_scroll=0';
      // get the url and merge with file name and then replace tokens
      const url = PageConfig.getTreeShareUrl();
      console.log(`Gen Appmode Command url ${url}.`);
      const newurl = URLExt.join(url, path).replace(token1, user).replace(token2, node);
      Clipboard.copyToSystem(newurl.concat(attr));
      console.log(`Gen Appmode Command has completed ${newurl.concat(attr)}.`);
    },
    isVisible: () =>
      tracker.currentWidget &&
      toArray(tracker.currentWidget.selectedItems()).length === 1,
    icon: linkIcon.bindprops({ stylesheet: 'menuItem' }),
    label: 'Generate Appmode Link'
  });
  console.log(`Gen Appmode Command has been added.`);
  const selectorNotDir = '.jp-DirListing-item[data-isdir="false"]';
  app.contextMenu.addItem({
     command: commandId,
     selector: selectorNotDir,
     rank: 10
    });
};

const plugins: JupyterFrontEndPlugin<any>[] = [shareFilePlugin];
export default plugins;
