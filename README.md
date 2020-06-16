# jupyterlab-gen-link

> Extend the filebrowser app with a context menu addition to generate a link


When running JupyterLab with this extension, the following menu item should
appears in list when right clicking a file:

   Generate Appmode Link

It will generate a link address to the notebook with appropriate settings to run in a browser as and anonymouse user without jupyterlab

to build and install

   npm install
   npm run build
   jupyter labextension link .
   jupyter lab build